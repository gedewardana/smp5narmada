'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const VARIANTS = {
    blue: {
        bg: 'bg-blue-500',
        lightBg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200'
    },
    emerald: {
        bg: 'bg-emerald-500',
        lightBg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200'
    },
    amber: {
        bg: 'bg-amber-500',
        lightBg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200'
    },
    rose: {
        bg: 'bg-rose-500',
        lightBg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-200'
    },
    orange: {
        bg: 'bg-orange-500',
        lightBg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200'
    },
    indigo: {
        bg: 'bg-indigo-500',
        lightBg: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-200'
    },
    slate: {
        bg: 'bg-slate-500',
        lightBg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200'
    }
}

/**
 * Reusable Summary Card for Admin Dashboard
 * 
 * @param {String} label - Card title
 * @param {Number|String} value - Main statistic value
 * @param {React.ElementType} icon - Lucide icon component
 * @param {String} variant - Color theme (blue, emerald, amber, rose, orange, indigo, slate)
 * @param {String} trend - Trend text (e.g., "+12%")
 * @param {Boolean} trendUp - Whether trend is positive
 * @param {String} description - Subtext description
 * @param {Number} index - Position for staggered animation
 */
export default function SummaryCard({
    label,
    value,
    icon: Icon,
    variant = 'blue',
    trend,
    trendUp = true,
    description,
    index = 0,
    children
}) {
    const config = VARIANTS[variant] || VARIANTS.blue

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
            {/* Top Accent Bar */}
            <div className={`absolute top-0 left-0 w-full h-1 ${config.bg}`} />

            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${config.lightBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${config.text}`} />
                    </div>

                    {/* Trend Badge (Optional) */}
                    {trend && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'
                        }`}>
                            {trendUp ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {trend}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">
                        {label}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
                    </h3>
                    {description && (
                        <p className="text-xs text-gray-400 font-medium truncate">
                            {description}
                        </p>
                    )}
                </div>

                {/* Custom Content Slot */}
                {children && (
                    <div className="mt-4 pt-4 border-t border-slate-50">
                        {children}
                    </div>
                )}
            </div>

            {/* Hover Shimmer Effect */}
            <div className={`absolute inset-0 ${config.lightBg} opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10`} />
        </motion.div>
    )
}
