import React, { useState, useCallback } from 'react';
import { Heart } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/formatPrice";

export const ProductCard = ({ product, onQuickAdd }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleQuickAdd = useCallback(() => {
        if (typeof onQuickAdd === "function") {
            onQuickAdd(product);
            return;
        }

        const defaultSize = product.sizes?.[0];
        const defaultColor = product.colors?.[0];

        if (!defaultSize || !defaultColor) {
            navigate(`/products/${product._id}`);
            return;
        }

        addToCart(product, {
            size: defaultSize,
            color: defaultColor,
            quantity: 1
        });
    }, [addToCart, navigate, onQuickAdd, product]);

    const badgeColors = {
        sale: "bg-red-500 text-white",
        new: "bg-green-500 text-white",
        bestseller: "bg-orange-500 text-white",
        "just-in": "bg-blue-500 text-white"
    };

    const normalizedBadge = product.badge?.toString().toLowerCase();
    const badgeClassName =
        normalizedBadge && badgeColors[normalizedBadge]
            ? badgeColors[normalizedBadge]
            : "bg-gray-700 text-white";

    return (
        <div
            className="group border border-neutral-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Product Image */}
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="h-[320px] w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover overlay */}
                {isHovered && (
                    <div className="absolute inset-x-0 bottom-0 p-4 space-y-2 bg-white/90 backdrop-blur-sm">
                        <Link
                            to={`/products/${product._id}`}
                            className="w-full bg-black text-white font-medium py-2.5 text-sm flex items-center justify-center hover:bg-neutral-800 transition-colors"
                        >
                            View Product
                        </Link>
                        <button
                            type="button"
                            onClick={handleQuickAdd}
                            className="w-full bg-black text-white font-medium py-2.5 text-sm flex items-center justify-center hover:bg-neutral-900 transition-colors"
                        >
                            Add to Bag
                        </button>
                    </div>
                )}

                {/* Badge */}
                {product.badge && (
                    <div className="absolute top-3 left-3">
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${badgeClassName}`}
                        >
                            {product.badge}
                        </span>
                    </div>
                )}

                {/* Wishlist */}
                <button
                    type="button"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setIsWishlisted((prev) => !prev);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:shadow-md hover:ring-1 hover:ring-black"
                >
                    <Heart
                        className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-neutral-900"
                            }`}
                    />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-1">
                <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                <p className="text-xs text-neutral-500 capitalize">{product.category}</p>

                {product.rating && (
                    <div className="flex items-center text-xs text-neutral-600 space-x-1">
                        <span>⭐ {product.rating}</span>
                        {product.reviewsCount != null && (
                            <span>({product.reviewsCount})</span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold">
                        {formatPrice(product.price)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const ProductCardSkeleton = () => {
    return (
        <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
            <div className="h-[320px] w-full bg-neutral-100 animate-pulse" />
            <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-100 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-neutral-100 rounded w-1/2 animate-pulse" />
                <div className="h-3 bg-neutral-100 rounded w-1/3 animate-pulse" />
            </div>
        </div>
    );
};