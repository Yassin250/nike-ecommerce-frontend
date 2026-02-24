// 🪝 useProducts Hook - Manages product fetching and filtering
// Location: src/hooks/useProducts.js

import { useState, useEffect, useCallback } from "react";
import api from "../lib/apiClient";

/**
 * Hook for fetching and managing products
 * @param {object} initialFilters - Initial filter values
 * @returns {object} Products data, loading state, and filter functions
 */
export function useProducts(initialFilters = {}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        sort: "newest",
        ...initialFilters,
    });
    const [meta, setMeta] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });

    /**
     * Fetch products from API
     */
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.getProducts(filters);

            if (response.success) {
                setProducts(response.data || []);
                setMeta(response.meta || meta);
            }
        } catch (err) {
            setError(err.message || "Failed to load products");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    /**
     * Fetch products when filters change
     */
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    /**
     * Update filters
     */
    const updateFilters = (newFilters) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1, // Reset to page 1 unless explicitly setting page
        }));
    };

    /**
     * Reset filters to initial state
     */
    const resetFilters = () => {
        setFilters({
            page: 1,
            limit: 20,
            sort: "newest",
            ...initialFilters,
        });
    };

    /**
     * Go to next page
     */
    const nextPage = () => {
        if (meta.hasNextPage) {
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    /**
     * Go to previous page
     */
    const prevPage = () => {
        if (meta.hasPrevPage) {
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    /**
     * Go to specific page
     */
    const goToPage = (page) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    return {
        products,
        loading,
        error,
        filters,
        meta,
        updateFilters,
        resetFilters,
        nextPage,
        prevPage,
        goToPage,
        refetch: fetchProducts,
    };
}

/**
 * Hook for fetching single product
 * @param {string} productId - Product ID
 * @returns {object} Product data and loading state
 */
export function useProduct(productId) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.getProduct(productId);

                if (response.success) {
                    setProduct(response.data);
                }
            } catch (err) {
                setError(err.message || "Failed to load product");
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return { product, loading, error };
}