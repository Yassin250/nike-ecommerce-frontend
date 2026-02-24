import React from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';

const AdminDashboardPage = () => {
    return (
        <main className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-[220px,1fr] gap-8">
            <AdminSidebar />
            <section className="space-y-6">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Overview</h1>
                        <p className="text-sm text-neutral-600">
                            High-level performance of your store.
                        </p>
                    </div>
                    <span className="text-xs text-neutral-500 uppercase tracking-wide border border-neutral-200 px-2 py-1 rounded-full">
                        Production
                    </span>
                </header>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="border border-neutral-200 rounded-xl p-4">
                        <p className="text-xs uppercase text-neutral-500 mb-1">
                            Revenue (30d)
                        </p>
                        <p className="text-xl font-semibold">$120,430</p>
                    </div>
                    <div className="border border-neutral-200 rounded-xl p-4">
                        <p className="text-xs uppercase text-neutral-500 mb-1">
                            Orders (30d)
                        </p>
                        <p className="text-xl font-semibold">3,214</p>
                    </div>
                    <div className="border border-neutral-200 rounded-xl p-4">
                        <p className="text-xs uppercase text-neutral-500 mb-1">
                            Conversion
                        </p>
                        <p className="text-xl font-semibold">3.8%</p>
                    </div>
                </div>
                <div className="border border-neutral-200 rounded-xl p-4">
                    <h2 className="text-sm font-semibold mb-2">Recent orders</h2>
                    <p className="text-sm text-neutral-600">
                        Connect to backend to show live data.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default AdminDashboardPage;