import React from "react";
import { Link } from "react-router-dom";

// Named export
export const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-xl font-bold">
                        NIKE.DEPLUX
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/products" className="text-sm font-medium hover:text-gray-600 transition-colors">
                            Products
                        </Link>
                        <Link to="/about" className="text-sm font-medium hover:text-gray-600 transition-colors">
                            About
                        </Link>
                        <Link to="/contact" className="text-sm font-medium hover:text-gray-600 transition-colors">
                            Contact
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

// Default export for backward compatibility
export default Header;