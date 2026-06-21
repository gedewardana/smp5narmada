"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/ui-admin/layout/Sidebar"
import Header from "@/components/header/Header"
import { TooltipProvider } from '@/components/ui/tooltip'
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation"

export default function DashboardLayout({ children }) {
    const [isCollapsed, setIsCollapsed]       = useState(false)
    const [isMobileOpen, setIsMobileOpen]     = useState(false)
    const pathname = usePathname()

    // Tutup drawer otomatis saat navigasi berpindah halaman
    useEffect(() => {
        setIsMobileOpen(false)
    }, [pathname])

    return (
        <TooltipProvider>
            <div className="flex h-screen overflow-hidden">

                {/* ── Sidebar (desktop: always visible | mobile: drawer) ── */}
                <Sidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    isMobileOpen={isMobileOpen}
                    onMobileClose={() => setIsMobileOpen(false)}
                />

                {/* ── Main Content ── */}
                <div
                    className={`
                        flex-1 flex flex-col overflow-hidden transition-all duration-300
                        ${isCollapsed ? "md:ml-20" : "md:ml-64"}
                    `}
                >
                    {/* Kirim onMenuToggle ke Header agar hamburger tampil di mobile */}
                    <Header onMenuToggle={() => setIsMobileOpen(true)} />

                    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                        <Toaster />
                        <SessionProvider>{children}</SessionProvider>
                    </main>
                </div>

            </div>
        </TooltipProvider>
    )
}