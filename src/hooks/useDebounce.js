// 🪝 useDebounce Hook - Delays value updates for performance
// Location: src/hooks/useDebounce.js

import { useState, useEffect } from "react";

/**
 * Debounces a value - delays updating until user stops typing
 * Useful for search inputs to avoid too many API calls
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {any} Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * // API call only happens after user stops typing for 500ms
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     fetchProducts({ search: debouncedSearch });
 *   }
 * }, [debouncedSearch]);
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if value changes before delay completes
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}