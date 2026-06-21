import React from 'react'
import Link from 'next/link'

function ButtonReasuble({
    children,
    onClick,
    href,
    variant = 'primary',
    size = 'md',
    disabled = false
}) {
    const baseStyle =
        "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    }

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    }

    const disabledStyle = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""

    const className = `${baseStyle} ${variants[variant]} ${sizes[size]} ${disabledStyle}`

    // Jika ada href → render Link
    if (href && !disabled) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        )
    }

    // Default render button
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </button>
    )
}

export default ButtonReasuble