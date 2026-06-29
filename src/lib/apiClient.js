
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * API Client Class
 * Handles all communication with the backend
 */
class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    /**
     * Get authentication token from localStorage
     */
    getAuthToken() {
        return localStorage.getItem("nikeAuthToken");
    }

    /**
     * Get refresh token from localStorage
     */
    getRefreshToken() {
        return localStorage.getItem("nikeRefreshToken");
    }

    /**
     * Save tokens to localStorage
     */
    saveTokens(accessToken, refreshToken) {
        localStorage.setItem("nikeAuthToken", accessToken);
        localStorage.setItem("nikeRefreshToken", refreshToken);
    }

    /**
     * Clear tokens from localStorage
     */
    clearTokens() {
        localStorage.removeItem("nikeAuthToken");
        localStorage.removeItem("nikeRefreshToken");
    }

    /**
     * Make HTTP request to backend
     * @param {string} endpoint - API endpoint (e.g., "/auth/login")
     * @param {object} options - Fetch options (method, body, headers, etc.)
     * @returns {Promise<object>} Response data
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getAuthToken();

        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        // Add Authorization header if token exists
        if (token && !options.skipAuth) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
            credentials: 'include',
        };

        // Convert body to JSON if it's an object
        if (options.body && typeof options.body === "object") {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            // Handle 401 Unauthorized - token expired
            if (response.status === 401 && !endpoint.includes("/auth/")) {
                // Try to refresh token
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    // Retry original request with new token
                    return this.request(endpoint, options);
                } else {
                    // Refresh failed, log out user
                    this.clearTokens();
                    window.location.href = "/account/login";
                    throw new Error("Session expired. Please login again.");
                }
            }

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            // Network error or JSON parse error
            if (error.name === "TypeError" && error.message.includes("fetch")) {
                throw new Error("Cannot connect to server. Please check your internet connection.");
            }
            throw error;
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) return false;

            const data = await this.request("/auth/refresh", {
                method: "POST",
                body: { refreshToken },
                skipAuth: true, // Don't add expired access token
            });

            if (data.success && data.data.accessToken) {
                this.saveTokens(data.data.accessToken, data.data.refreshToken);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // ==================== AUTH ENDPOINTS ====================

    /**
     * Register new user
     */
    async register(userData) {
        const data = await this.request("/auth/register", {
            method: "POST",
            body: userData,
        });
        
        if (data.success && data.data) {
            this.saveTokens(data.data.accessToken, data.data.refreshToken);
        }
        
        return data;
    }

    /**
     * Login user
     */
    async login(email, password) {
        const data = await this.request("/auth/login", {
            method: "POST",
            body: { email, password },
        });
        
        if (data.success && data.data) {
            this.saveTokens(data.data.accessToken, data.data.refreshToken);
        }
        
        return data;
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            await this.request("/auth/logout", { method: "POST" });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            this.clearTokens();
        }
    }

    /**
     * Get current user info
     */
    async getMe() {
        return this.request("/auth/me");
    }

    // ==================== PRODUCTS ENDPOINTS ====================

    /**
     * Get all products with optional filters
     * @param {object} filters - { category, gender, search, minPrice, maxPrice, page, limit, sort }
     */
    async getProducts(filters = {}) {
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value);
            }
        });

        const queryString = params.toString();
        return this.request(`/products${queryString ? `?${queryString}` : ""}`);
    }

    /**
     * Get single product by ID
     */
    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    // ==================== CART ENDPOINTS ====================

    /**
     * Get user's cart
     */
    async getCart() {
        return this.request("/cart");
    }

    /**
     * Add item to cart
     */
    async addToCart(productId, quantity, selectedSize, selectedColor) {
        return this.request("/cart", {
            method: "POST",
            body: { productId, quantity, selectedSize, selectedColor },
        });
    }

    /**
     * Update cart item quantity
     */
    async updateCartItem(itemId, quantity) {
        return this.request(`/cart/${itemId}`, {
            method: "PATCH",
            body: { quantity },
        });
    }

    /**
     * Remove item from cart
     */
    async removeCartItem(itemId) {
        return this.request(`/cart/${itemId}`, {
            method: "DELETE",
        });
    }

    /**
     * Clear entire cart
     */
    async clearCart() {
        return this.request("/cart", {
            method: "DELETE",
        });
    }

    // ==================== ORDERS ENDPOINTS ====================

    /**
     * Create new order
     */
    async createOrder(orderData) {
        return this.request("/orders", {
            method: "POST",
            body: orderData,
        });
    }

    /**
     * Get user's orders
     */
    async getOrders() {
        return this.request("/orders");
    }

    /**
     * Get single order by ID
     */
    async getOrder(id) {
        return this.request(`/orders/${id}`);
    }

    // ==================== PAYMENT ENDPOINTS ====================

    /**
     * Create Stripe payment intent
     */
    async createPaymentIntent() {
        return this.request("/payments/create-intent", {
            method: "POST",
        });
    }

    // ==================== USER ENDPOINTS ====================

    /**
     * Update user profile
     */
    async updateProfile(updates) {
        return this.request("/users/me", {
            method: "PATCH",
            body: updates,
        });
    }

    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        return this.request("/users/me/password", {
            method: "PATCH",
            body: { currentPassword, newPassword },
        });
    }

    // ==================== ADMIN - PRODUCTS ====================

    /**
     * Get all products (admin - includes inactive)
     */
    async adminGetProducts(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return this.request(`/admin/products${params ? `?${params}` : ""}`);
    }

    /**
     * Create product (admin)
     */
    async adminCreateProduct(productData) {
        return this.request("/admin/products", {
            method: "POST",
            body: productData,
        });
    }

    /**
     * Update product (admin)
     */
    async adminUpdateProduct(id, updates) {
        return this.request(`/admin/products/${id}`, {
            method: "PUT",
            body: updates,
        });
    }

    /**
     * Delete product (admin)
     */
    async adminDeleteProduct(id) {
        return this.request(`/admin/products/${id}`, {
            method: "DELETE",
        });
    }

    // ==================== ADMIN - ORDERS ====================

    /**
     * Get all orders (admin)
     */
    async adminGetOrders(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return this.request(`/admin/orders${params ? `?${params}` : ""}`);
    }

    /**
     * Get single order (admin)
     */
    async adminGetOrder(id) {
        return this.request(`/admin/orders/${id}`);
    }

    /**
     * Update order status (admin)
     */
    async adminUpdateOrder(id, updates) {
        return this.request(`/admin/orders/${id}`, {
            method: "PATCH",
            body: updates,
        });
    }

    // ==================== ADMIN - USERS ====================

    /**
     * Get all users (admin)
     */
    async adminGetUsers(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return this.request(`/admin/users${params ? `?${params}` : ""}`);
    }

    /**
     * Get single user (admin)
     */
    async adminGetUser(id) {
        return this.request(`/admin/users/${id}`);
    }

    /**
     * Update user (admin)
     */
    async adminUpdateUser(id, updates) {
        return this.request(`/admin/users/${id}`, {
            method: "PATCH",
            body: updates,
        });
    }

    // ==================== ADMIN - ANALYTICS ====================

    /**
     * Get dashboard analytics (admin)
     */
    async adminGetAnalytics() {
        return this.request("/admin/analytics");
    }

    /**
     * Get revenue analytics (admin)
     */
    async adminGetRevenueAnalytics(days = 30) {
        return this.request(`/admin/analytics/revenue?days=${days}`);
    }

    /**
     * Get product analytics (admin)
     */
    async adminGetProductAnalytics() {
        return this.request("/admin/analytics/products");
    }

    /**
     * Get user analytics (admin)
     */
    async adminGetUserAnalytics(days = 30) {
        return this.request(`/admin/analytics/users?days=${days}`);
    }
}

// Export singleton instance
export const api = new ApiClient();
export default api;