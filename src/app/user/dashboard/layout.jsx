"use client"

import { useState } from "react"
import Sidebar from "@/components/ui-user/layout/Sidebar"
import MobileNavBar from "@/components/ui-user/layout/MobileNavBar"
import Header from "@/components/header/Header"
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }) {

    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden">

            {/* ── Sidebar — desktop only (hidden on mobile) ── */}
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* ── Main Content ── */}
            {/* ml-0 default (mobile), md:ml-20/ml-64 untuk desktop sesuai collapse state */}
            <div
                className={`
                    flex-1 flex flex-col overflow-hidden transition-all duration-300
                    ${isCollapsed ? "md:ml-20" : "md:ml-64"}
                `}
            >
                <Header />

                {/* pb-20 agar konten tidak tertutup Bottom Nav Bar di mobile */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6 pb-24 md:pb-6">
                    <Toaster />
                    <SessionProvider>{children}</SessionProvider>
                </main>
            </div>

            {/* ── Bottom Navigation — mobile only (hidden on desktop) ── */}
            <MobileNavBar />

        </div>
    )
}