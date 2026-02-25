import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../lib/constants";

export const Navbar = () => {
    const { getCartCount } = useCart();
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const isAuthenticated = !!user;
    const cartCount = getCartCount(); // Use the context method instead

    const NAV_ITEMS = [
        { label: "New & Featured", to: ROUTES.HOME },
        { label: "Men", to: `${ROUTES.PRODUCTS}?category=men` },
        { label: "Women", to: `${ROUTES.PRODUCTS}?category=women` },
        { label: "Kids", to: `${ROUTES.PRODUCTS}?category=kids` },
        { label: "Sale", to: `${ROUTES.PRODUCTS}?category=sale` },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Nav */}
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link
                        to={ROUTES.HOME}
                        className="text-xl font-bold tracking-tighter"
                    >
                        NIKE.DEPLUX
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                className={({ isActive }) =>
                                    `relative transition-colors ${isActive
                                        ? "text-black"
                                        : "text-neutral-600 hover:text-black"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">

                        {/* Search */}
                        <div className="hidden lg:block relative">
                            <div
                                className={`flex items-center bg-neutral-100 rounded-full transition-all duration-300 ${isSearchOpen ? "w-52" : "w-44"
                                    }`}
                            >
                                <Search className="absolute left-3 w-5 h-5 text-neutral-700" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="bg-transparent pl-10 pr-3 py-2 w-full text-sm focus:outline-none"
                                    onFocus={() => setIsSearchOpen(true)}
                                    onBlur={() => setIsSearchOpen(false)}
                                />
                            </div>
                        </div>

                        {/* Cart */}
                        <button
                            aria-label="Open cart"
                            onClick={() => navigate(ROUTES.CART)}
                            className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Account */}
                        {isAuthenticated ? (
                            <div className="hidden sm:flex items-center gap-4 text-sm">
                                <button
                                    onClick={() => navigate(ROUTES.PROFILE)}
                                    className="hover:text-black transition-colors"
                                >
                                    {user?.name?.split(" ")[0]}
                                </button>

                                {isAdmin && (
                                    <button
                                        onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                                        className="hover:text-black transition-colors"
                                    >
                                        Admin
                                    </button>
                                )}

                                <button
                                    onClick={logout}
                                    className="text-neutral-500 hover:text-black transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate(ROUTES.LOGIN)}
                                className="hidden sm:block text-sm font-medium hover:text-black transition-colors"
                            >
                                <User className="w-6 h-6" />
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            aria-label="Toggle menu"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>

                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-neutral-200 space-y-4">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-sm font-medium text-neutral-700 hover:text-black transition-colors"
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <div className="pt-4 border-t border-neutral-200">
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => {
                                            navigate(ROUTES.PROFILE);
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-2"
                                    >
                                        Profile
                                    </button>

                                    {isAdmin && (
                                        <button
                                            onClick={() => {
                                                navigate(ROUTES.ADMIN_DASHBOARD);
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left py-2"
                                        >
                                            Admin
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-2 text-neutral-500"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        navigate(ROUTES.LOGIN);
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left py-2"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </header>
    );
};