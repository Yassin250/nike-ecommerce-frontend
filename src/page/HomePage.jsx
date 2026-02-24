import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/apiClient';
import ProductGrid from '../product/ProductGrid';
import { Button } from '../ui/Button';
import { useCartContext } from '../context/CartContext';
import { ROUTES } from '../lib/constants';
import { formatPrice } from '../lib/formatPrice';

const HomePage = () => {
    const { addToCart } = useCartContext();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        api.getProducts({ limit: 8 })
            .then(res => {
                if (res.success) {
                    const list = Array.isArray(res.data) ? res.data : (res.data.products ?? []);
                    setProducts(list.map(p => ({ ...p, id: p._id })));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const heroProduct = products[0];

    const handleQuickAdd = useCallback(
        (product) => {
            const defaultSize = product.sizes?.[0];
            const defaultColor = product.colors?.[0];
            if (!defaultSize || !defaultColor) {
                navigate(`${ROUTES.PRODUCTS}/${product._id}`);  // ← use _id
                return;
            }
            addToCart(product, { size: defaultSize, color: defaultColor, quantity: 1 });
        },
        [addToCart, navigate]
    );

    return (
        <main>
            <section className="max-w-6xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center">
                {heroProduct && (
                    <>
                        <div className="space-y-6">
                            <p className="text-xs tracking-[0.2em] uppercase text-neutral-500">New Drop</p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                Move like you mean it.
                            </h1>
                            <p className="text-sm text-neutral-600 max-w-md">
                                Precision-crafted performance for every run, cut and jump.
                            </p>
                            <div className="flex gap-3">
                                <Button onClick={() => navigate(ROUTES.PRODUCTS)}>Shop Now</Button>
                                <Button variant="secondary" onClick={() => navigate(`${ROUTES.PRODUCTS}?featured=true`)}>
                                    View Collection
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-100">
                                <img src={heroProduct.image} alt={heroProduct.name}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                            </div>
                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-3 rounded-xl shadow-lg space-y-1">
                                <p className="text-xs uppercase tracking-wide text-neutral-500">Featured</p>
                                <p className="text-sm font-semibold">{heroProduct.name}</p>
                                <p className="text-xs text-neutral-600">{formatPrice(heroProduct.price)} · {heroProduct.category}</p>
                            </div>
                        </div>
                    </>
                )}
            </section>

            <section className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex items-baseline justify-between mb-6">
                    <h2 className="text-xl font-semibold tracking-tight">Best Sellers</h2>
                    <button className="text-xs uppercase tracking-wide text-neutral-500 hover:text-black transition-colors"
                        onClick={() => navigate(ROUTES.PRODUCTS)}>View All</button>
                </div>
                <ProductGrid products={products} onQuickAdd={handleQuickAdd} isLoading={loading} />
            </section>
        </main>
    );
};

export default HomePage;