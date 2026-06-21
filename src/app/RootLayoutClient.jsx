'use client';

import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";

const jakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"], // Variasi ketebalan font
    variable: "--font-jakarta",
});

export default function RootLayoutClient({ children }) {
    return (
        <html lang="id">
            <body className={`${jakartaSans.variable} ${jakartaSans.className} antialiased text-gray-800 bg-gray-50`}>
                <SessionProvider>
                    <TooltipProvider>{children}</TooltipProvider>
                </SessionProvider>
            </body>
        </html>
    );
}