import React from "react";
import { Twitter, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#111111] text-white mt-auto">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Column 1 */}
                    <div>
                        <h3 className="text-[10px] font-medium tracking-wider mb-4 uppercase">
                            Get Help
                        </h3>
                        <ul className="space-y-3 text-[#7E7E7E] text-xs">
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Order Status
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Delivery
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Returns
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Payment Options
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="text-[10px] font-medium tracking-wider mb-4 uppercase">
                            About Nike
                        </h3>
                        <ul className="space-y-3 text-[#7E7E7E] text-xs">
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    News
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Investors
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Sustainability
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 - Empty on mobile */}
                    <div className="hidden lg:block"></div>

                    {/* Column 4 - Social Icons */}
                    <div className="flex lg:justify-end">
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="w-8 h-8 bg-[#7E7E7E] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-[#7E7E7E] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-[#7E7E7E] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
                            >
                                <Youtube className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-[#7E7E7E] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="pt-4 border-t border-[#222222]">
                    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#7E7E7E]">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <span>© 2026 Nike, Inc. All Rights Reserved</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="hover:text-white transition-colors">
                                Guides
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                Terms of Sale
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                Terms of Use
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                Nike Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}



