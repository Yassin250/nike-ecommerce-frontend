import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../lib/constants';

export const AdminSidebar = () => {
    const links = [
        { to: ROUTES.ADMIN_DASHBOARD, label: 'Overview' },
        { to: ROUTES.ADMIN_PRODUCTS, label: 'Products' },
        { to: ROUTES.ADMIN_ORDERS, label: 'Orders' },
        { to: ROUTES.ADMIN_USERS, label: 'Users' },
        { to: ROUTES.ADMIN_ANALYTICS, label: 'Analytics' }
    ];
    return (
        <aside className="border-r border-neutral-200 py-6 px-4 space-y-4 text-sm">
            <h2 className="font-semibold text-xs uppercase tracking-wide">
                Admin
            </h2>
            <nav className="space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg ${isActive ? 'bg-black text-white' : 'text-neutral-700'
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};