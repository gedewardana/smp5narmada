function SectionLabel({ children }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-4">
            {children}
        </span>
    )
}

export default SectionLabel