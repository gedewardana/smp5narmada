'use client'

import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"

/**
 * Reusable Form Section Wrapper
 */
export function FormSection({ title, description, children, icon: Icon, className = "" }) {
    return (
        <div className={`mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500 ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
                    {description && <p className="text-xs text-gray-500 font-medium">{description}</p>}
                </div>
            </div>
            <div className="bg-white/50 p-1 rounded-2xl">
                {children}
            </div>
        </div>
    )
}

/**
 * Reusable Form Grid for consistent multi-column layout
 */
export function FormGrid({ children, cols = 2 }) {
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-3",
        4: "grid-cols-2 md:grid-cols-4"
    }

    return (
        <div className={`grid ${gridCols[cols] || gridCols[2]} gap-x-6 gap-y-5`}>
            {children}
        </div>
    )
}

/**
 * Reusable Input Component with Professional Styling
 */
export function FormInput({
    label,
    name,
    value,
    onChange,
    onErrorClear,
    type = 'text',
    required = false,
    placeholder = '',
    options = [],
    className = '',
    icon: Icon,
    helpText = '',
    error = null,
    disabled = false
}) {
    const handleChange = (e) => {
        onChange?.(e)
        if (error && onErrorClear) onErrorClear(name)
    }
    const commonLabelClass = "block text-[11px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-widest flex items-center gap-1 ml-1"
    const inputBaseClass = `w-full transition-all duration-300 focus:ring-4 rounded-lg border-gray-200 bg-white text-sm shadow-sm h-11 ${error
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 hover:border-red-500'
        : 'focus:ring-blue-100 focus:border-blue-600 hover:border-blue-400'
        }`

    const labelElement = (
        <label className={commonLabelClass}>
            {label} {required && <span className="text-rose-500 font-black">*</span>}
        </label>
    )

    if (type === 'select') {
        return (
            <div className={`space-y-1 ${className}`}>
                {labelElement}
                <div className="relative group">
                    {Icon && (
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                            <Icon className="w-4 h-4" />
                        </div>
                    )}
                    <select
                        name={name}
                        // value={value}
                        value={value ?? ''}
                        onChange={handleChange}
                        className={`${inputBaseClass} appearance-none cursor-pointer pr-10 ${Icon ? 'pl-11' : 'px-4'}`}
                        required={required}
                        disabled={disabled}
                    >
                        <option value="" disabled>Pilih {label}</option>
                        {options.map((opt, idx) => {
                            const isObj = typeof opt === 'object' && opt !== null;
                            const label = isObj ? opt.label : opt;
                            const val = isObj ? opt.value : opt;

                            return (
                                <option key={idx} value={val}>
                                    {String(label || 'Unknown')}
                                </option>
                            );
                        })}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
                {error ? (
                    <p className="text-[10px] text-red-500 ml-1 font-bold">{error}</p>
                ) : helpText && (
                    <p className="text-[10px] text-gray-400 ml-1 italic font-medium">{helpText}</p>
                )}
            </div>
        )
    }

    return (
        <div className={`space-y-1 ${className}`}>
            {labelElement}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <Input
                    type={type}
                    name={name}
                    //value={value}
                    value={value ?? ''}
                    onChange={handleChange}
                    className={`${inputBaseClass} ${Icon ? 'pl-11' : 'px-4'}`}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    min={type === 'number' ? 0 : undefined}
                    step={type === 'number' && (name?.includes('nilai') || name?.includes('badan')) ? '0.01' : undefined}
                />
            </div>
            {error ? (
                <p className="text-[10px] text-red-500 ml-1 font-bold">{error}</p>
            ) : helpText && (
                <p className="text-[10px] text-gray-400 ml-1 italic font-medium">{helpText}</p>
            )}
        </div>
    )
}

/**
 * Reusable Checkbox Component with Professional Styling
 */
export function FormCheckbox({ label, name, checked, onChange, helpText = "Tandai jika ya", disabled = false }) {
    return (
        <label className="flex items-start gap-4 p-4 bg-white hover:bg-blue-50/30 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md h-full">
            <div className="relative flex items-center mt-0.5">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="w-5 h-5 text-blue-600 rounded-[6px] border-gray-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 cursor-pointer"
                    disabled={disabled}
                />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors leading-tight">{label}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{helpText}</span>
            </div>
        </label>
    )
}
