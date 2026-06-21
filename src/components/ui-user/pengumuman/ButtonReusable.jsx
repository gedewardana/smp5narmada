'use client'

/**
 * ButtonReusable - Reusable button component
 * @param {function} onClick - Click handler
 * @param {string} children - Button text
 * @param {string} variant - Button color variant: 'primary', 'success', 'secondary', 'danger'
 * @param {string} size - Button size: 'sm', 'md', 'lg'
 * @param {string} icon - Optional icon emoji
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional custom classes
 */
export default function ButtonReusable({
    onClick,
    children,
    variant = 'primary',
    size = 'md',
    icon,
    disabled = false,
    className = ''
}) {
    // Color variants
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-white',
        rejected: 'bg-white text-red-700 border border-red-300 px-6 py-2.5 rounded-lg hover:bg-red-50 transition-colors font-medium shadow-sm flex items-center gap-2',
        cencle: 'bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        forgot: 'bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors',

    }

    // Size variants
    const sizes = {
        sm: 'px-4 py-2 text-sm', //kecil
        md: 'px-6 py-3 text-base', //sedang
        lg: 'px-8 py-4 text-lg' //besar
    }

    // Disabled state
    const disabledClass = disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer'

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`
                ${variants[variant]} 
                ${sizes[size]} 
                ${disabledClass}
                rounded-lg font-semibold transition-colors 
                flex items-center gap-2
                ${className}
            `}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    )
}