/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/apiClient";

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

// Alias for compatibility with different naming conventions
export const useAuthContext = useAuth;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from localStorage on mount
    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = api.getAuthToken();

            if (token) {
                try {
                    // ✨ NEW: Verify token with backend
                    const response = await api.getMe();

                    if (response.success && response.data) {
                        setUser(response.data);
                    }
                } catch (err) {
                    console.error("Auth check failed:", err);
                    // Token invalid, clear it
                    api.clearTokens();
                    setUser(null);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);



    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.name - Full name
     * @param {string} userData.email - Email address
     * @param {string} userData.password - Password
     * @returns {Promise<Object>} User object
     */
    const register = async (userData) => {
        setLoading(true);
        setError(null);

        try {
            // ✨ NEW: Call backend API instead of localStorage
            const response = await api.register(userData);

            if (response.success && response.data) {
                // Backend returns: { user, accessToken, refreshToken }
                const newUser = response.data.user;

                // Save user to state
                setUser(newUser);
                setLoading(false);

                return newUser;
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User object
     */
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            // ✨ NEW: Call backend API
            const response = await api.login(email, password);

            if (response.success && response.data) {
                const loggedInUser = response.data.user;

                // Save user to state
                setUser(loggedInUser);
                setLoading(false);

                return loggedInUser;
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    /**
     * Logout user
     */
    const logout = async () => {
        try {
            // ✨ NEW: Call backend to clear refresh token
            await api.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            // Clear local state
            setUser(null);
            setError(null);
        }
    };

    /**
     * Update user profile
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} Updated user object
     */
    const updateProfile = async (updates) => {
        setLoading(true);
        setError(null);

        try {
            // ✨ NEW: Call backend API
            const response = await api.updateProfile(updates);

            if (response.success && response.data) {
                setUser(response.data);
                setLoading(false);
                return response.data;
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    /**
     * Change user password
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<void>}
     */
    const changePassword = async (currentPassword, newPassword) => {
        setLoading(true);
        setError(null);

        try {
            // ✨ NEW: Call backend API
            await api.changePassword(currentPassword, newPassword);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = !!user;

    /**
     * Check if user is admin
     */
    const isAdmin = user?.role === "admin";

    /**
     * Initialize admin user (for development)
     * Call this once to create a default admin account
     */


    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated,
        isAdmin,
        setError, // For manual error handling
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}