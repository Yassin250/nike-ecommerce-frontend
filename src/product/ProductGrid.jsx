import React from "react";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";

export default function ProductGrid({
    products = [],
    onQuickAdd,
    isLoading = false,
    skeletonCount = 8
}) {
    const showSkeletons = isLoading && skeletonCount > 0;

    if (showSkeletons) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onQuickAdd={onQuickAdd}
                />
            ))}
        </div>
    );
}