'use client'
import React from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'react-hot-toast'
import Particles from '@/components/home/Particles'
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }) {
    return (
        <div className="relative min-h-screen bg-black overflow-hidden">

            {/* <div className="absolute inset-0 z-0">
                <Particles
                    particleColors={["#ffffff"]}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover
                    alphaParticles={false}
                    disableRotation={false}
                    pixelRatio={1}
                />
            </div> */}

            <div className="relative z-10">
                <SessionProvider>
                    <TooltipProvider>
                        <Toaster />
                        {children}
                    </TooltipProvider>
                </SessionProvider>
            </div>

        </div>
    )
}