import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/apiClient';
import { useCartContext } from '../context/CartContext';
import { Button } from '../ui/Button';
import { formatPrice } from '../lib/formatPrice';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCartContext();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        setLoading(true);
        api.getProduct(id)
            .then(res => {
                if (res.success && res.data) {
                    setProduct(res.data);
                    setSelectedSize(res.data.sizes?.[0] ?? null);
                    setSelectedColor(res.data.colors?.[0] ?? null);
                    setSelectedImage(res.data.image ?? null);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <main className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
                <div className="aspect-[4/5] rounded-3xl bg-neutral-100 animate-pulse" />
                <div className="space-y-4">
                    <div className="h-4 bg-neutral-100 rounded w-1/3 animate-pulse" />
                    <div className="h-8 bg-neutral-100 rounded w-2/3 animate-pulse" />
                    <div className="h-20 bg-neutral-100 rounded animate-pulse" />
                    <div className="h-6 bg-neutral-100 rounded w-1/4 animate-pulse" />
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="max-w-6xl mx-auto px-4 py-10 text-center space-y-4">
                <p className="text-lg font-medium">Product not found.</p>
                <Button onClick={() => navigate('/products')}>Back to Products</Button>
            </main>
        );
    }

    const handleAdd = () => {
        if (!selectedSize || !selectedColor) return;
        addToCart(product, {
            size: selectedSize?.size ?? selectedSize,
            color: selectedColor?.name ?? selectedColor,
            quantity: 1
        });
    };

    return (
        <main className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
            {/* Images */}
            <div className="space-y-3">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-100">
                    <img
                        src={selectedImage || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Thumbnail strip */}
                {product.images?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                        {product.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(img)}
                                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === img ? 'border-black' : 'border-transparent'
                                    }`}
                            >
                                <img src={img} alt={`${product.name} ${i + 1}`}
                                    className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="space-y-6">
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                        {product.category}
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
                    <p className="text-sm text-neutral-600 max-w-md">{product.description}</p>
                </div>

                <p className="text-xl font-semibold">{formatPrice(product.price)}</p>

                <div className="space-y-4">
                    {/* Colors */}
                    <div>
                        <p className="text-xs uppercase text-neutral-500 mb-2">
                            Color: <span className="text-black font-medium">
                                {selectedColor?.name ?? selectedColor}
                            </span>
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {product.colors.map((color, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedColor(color)}
                                    title={color?.name ?? color}
                                    style={{ backgroundColor: color?.code ?? color }}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color
                                        ? 'border-black scale-110'
                                        : 'border-neutral-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <p className="text-xs uppercase text-neutral-500 mb-2">
                            Size: <span className="text-black font-medium">
                                {selectedSize?.size ?? selectedSize}
                            </span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size, i) => {
                                const sizeLabel = size?.size ?? size;
                                const inStock = size?.inStock ?? true;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => inStock && setSelectedSize(size)}
                                        disabled={!inStock}
                                        className={`px-3 py-2 border text-xs rounded-full transition-colors ${selectedSize === size
                                            ? 'border-black bg-black text-white'
                                            : inStock
                                                ? 'border-neutral-300 hover:border-black'
                                                : 'border-neutral-200 text-neutral-300 cursor-not-allowed line-through'
                                            }`}
                                    >
                                        {sizeLabel}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button onClick={handleAdd} className="flex-1"
                        disabled={!selectedSize || !selectedColor}>
                        Add to Cart
                    </Button>
                    <Button variant="secondary" className="flex-1">
                        Buy Now
                    </Button>
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm text-neutral-600">
                    <p>✓ Free shipping on orders over $100.</p>
                    <p>✓ 30-day free returns on unworn items.</p>
                    {product.inStock
                        ? <p className="text-green-600">✓ In Stock</p>
                        : <p className="text-red-500">✗ Out of Stock</p>
                    }
                </div>
            </div>
        </main>
    );
};

export default ProductDetailsPage;