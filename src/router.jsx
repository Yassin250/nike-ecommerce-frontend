import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const HomePage = lazy(() => import('./page/HomePage'));
const ProductsPage = lazy(() => import('./page/ProductsPage')); // plural
const ProductDetailsPage = lazy(() => import('./page/ProductDetailsPage'));
const CartPage = lazy(() => import('./page/CartPage'));
const CheckoutPage = lazy(() => import('./page/CheckoutPage'));
const LoginPage = lazy(() => import('./page/LoginPage'));
const RegisterPage = lazy(() => import('./page/RegisterPage'));
const ProfilePage = lazy(() => import('./page/ProfilePage'));
const AdminDashboardPage = lazy(() => import('./page/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./page/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('./page/AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('./page/AdminUsersPage'));
const AdminAnalyticsPage = lazy(() => import('./page/AdminAnalyticsPage'));

const PageFallback = () => {
    return (
        <div className="flex-1 flex items-center justify-center py-16">
            <div className="w-full max-w-6xl px-4 space-y-8 animate-pulse">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="h-4 w-32 bg-neutral-200 rounded" />
                        <div className="h-8 w-3/4 bg-neutral-200 rounded" />
                        <div className="h-16 w-full bg-neutral-200 rounded" />
                        <div className="flex gap-3">
                            <div className="h-10 w-28 bg-neutral-200 rounded-full" />
                            <div className="h-10 w-32 bg-neutral-200 rounded-full" />
                        </div>
                    </div>
                    <div className="h-72 md:h-80 lg:h-96 bg-neutral-200 rounded-3xl" />
                </div>
                <div className="space-y-4">
                    <div className="h-6 w-40 bg-neutral-200 rounded" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-64 bg-neutral-200 rounded-xl"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AppRouter = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <Suspense fallback={<PageFallback />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} /> {/* fixed */}
                        <Route path="/products/:id" element={<ProductDetailsPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/account/login" element={<LoginPage />} />
                        <Route path="/account/register" element={<RegisterPage />} />
                        <Route path="/account/profile" element={<ProfilePage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/admin/products" element={<AdminProductsPage />} />
                        <Route path="/admin/orders" element={<AdminOrdersPage />} />
                        <Route path="/admin/users" element={<AdminUsersPage />} />
                        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                    </Routes>
                </Suspense>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default AppRouter;