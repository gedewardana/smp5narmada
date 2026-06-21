function SectionHeading({ pre, highlight, sub }) {
    return (
        <div className="mb-8">
            <h2 className="text-[2rem] md:text-[2.5rem] font-black text-slate-900 leading-[1.1] tracking-tight">
                {pre}{' '}
                <span className="relative inline-block text-emerald-600">
                    {highlight}
                    <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
                        <path d="M0 2 Q50 0 100 2" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4" />
                    </svg>
                </span>
            </h2>
            {sub && <p className="mt-3 text-slate-500 text-[0.9rem] leading-relaxed max-w-xl">{sub}</p>}
        </div>
    )
}

export default SectionHeading