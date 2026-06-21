'use client'

function FormWrapper({ children, title, description, showWarning }) {
    return (
        <div className="p-1 md:p-2">
            {/* Header - Refined for Professional Editorial Look */}
            <div className="mb-8 pl-4 border-l-4 border-indigo-600">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight lg:text-3xl mb-2">
                    {title}
                </h1>
                {description && (
                    <p className="text-slate-500 font-medium text-sm lg:text-base max-w-2xl leading-relaxed">
                        {description}
                    </p>
                )}
                {showWarning && (
                    <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl group transition-all duration-300 hover:bg-rose-100/50">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-xs text-rose-700 font-bold uppercase tracking-wider">
                            Wajib Diisi: <span className="text-rose-900">*</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Form Content - Clean Slate */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
            </div>
        </div>


    )
}

export default FormWrapper