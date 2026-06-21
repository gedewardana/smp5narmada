// components/LinkReusable.jsx atau components/ui/LinkReusable.jsx
import Link from 'next/link';

export default function LinkReusable({
    href,
    children,
    icon = "✏️",
    variant = "primary",
    size = "md",
    className = "",
    noWrapper = false
}) {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
        danger: "bg-red-600 hover:bg-red-700 text-white"
    };

    const sizes = {
        sm: "px-2 py-1 text-sm",
        md: "px-3 py-2",
        lg: "px-4 py-3 text-lg"
    };

    if (noWrapper) {
        return (
            <Link
                href={href}
                className={`inline-flex items-center gap-2 rounded-lg transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
            >
                {/* {icon && <span>{icon}</span>} */}
                {children}
            </Link>
        )
    }

    return (
        <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
                href={href}
                className={`inline-flex items-center gap-2 rounded-lg transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
            >
                {/* {icon && <span>{icon}</span>} */}
                {children}
            </Link>
        </div>
    );
}
