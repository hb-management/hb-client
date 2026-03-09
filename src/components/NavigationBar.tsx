"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Calculator } from 'lucide-react';

export default function NavigationBar() {
    const pathname = usePathname();

    return (
        <div className="border-b bg-card">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-1">
                    <Link
                        href="/orders"
                        className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${pathname?.startsWith('/orders') || pathname === '/'
                                ? 'border-primary text-primary font-semibold'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Package className="size-5" />
                        Đơn đặt hàng
                    </Link>
                    <Link
                        href="/formulas"
                        className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${pathname?.startsWith('/formulas')
                                ? 'border-primary text-primary font-semibold'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Calculator className="size-5" />
                        Kích thước theo thùng
                    </Link>
                </div>
            </div>
        </div>
    );
}
