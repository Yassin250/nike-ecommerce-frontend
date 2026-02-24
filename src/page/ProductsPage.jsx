import React, { useState, useEffect, useMemo } from 'react';
import api from '../lib/apiClient';
import { ProductCard } from '../product/ProductCard';
import { useCartContext } from '../context/CartContext';

const ProductsPage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [genderFilter, setGenderFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sort, setSort] = useState('newest');
    const { addToCart } = useCartContext();

    // Fetch from real API once
    useEffect(() => {
        api.getProducts()
            .then(res => {
                if (res.success) {
                    const list = Array.isArray(res.data)
                        ? res.data
                        : res.data.products ?? [];
                    setAllProducts(list);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Filter + sort client-side from real data
    const filtered = useMemo(() => {
        let list = [...allProducts];
        if (genderFilter !== 'all') {
            list = list.filter(p => p.gender?.toLowerCase() === genderFilter);
        }
        if (categoryFilter !== 'all') {
            list = list.filter(p => p.category?.toLowerCase() === categoryFilter);
        }
        if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
        else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
        return list;
    }, [allProducts, genderFilter, categoryFilter, sort]);

    return (
        <main className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-[240px,1fr] gap-8">
            <aside className="space-y-6">
                <h2 className="font-semibold text-sm uppercase tracking-wide">Filters</h2>
                <div>
                    <h3 className="text-xs uppercase text-neutral-500 mb-2">Gender</h3>
                    <div className="space-y-1 text-sm">
                        {['all', 'men', 'women'].map(value => (
                            <label key={value} className="flex items-center gap-2">
                                <input type="radio" name="gender" value={value}
                                    checked={genderFilter === value}
                                    onChange={e => setGenderFilter(e.target.value)} />
                                <span className="capitalize">{value}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xs uppercase text-neutral-500 mb-2">Category</h3>
                    <div className="space-y-1 text-sm">
                        {['all', 'running', 'lifestyle'].map(value => (
                            <label key={value} className="flex items-center gap-2">
                                <input type="radio" name="category" value={value}
                                    checked={categoryFilter === value}
                                    onChange={e => setCategoryFilter(e.target.value)} />
                                <span className="capitalize">{value}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </aside>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-neutral-600">
                        {loading ? 'Loading...' : `${filtered.length} styles`}
                    </p>
                    <select className="border border-neutral-300 rounded-full px-3 py-1 text-xs"
                        value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="price-asc">Price: Low – High</option>
                        <option value="price-desc">Price: High – Low</option>
                    </select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-[380px] bg-neutral-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filtered.map(p => (
                            <ProductCard
                                key={p._id}
                                product={p}
                                onQuickAdd={prod =>
                                    addToCart(prod, {
                                        size: prod.sizes?.[0],
                                        color: prod.colors?.[0],
                                        quantity: 1
                                    })
                                }
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default ProductsPage;