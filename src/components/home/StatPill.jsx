function StatPill({ value, label, bg, text, border }) {
    return (
        <div style={{ background: bg, border: `1.5px solid ${border}`, color: text }}
            className="rounded-2xl p-5 text-center transition-transform hover:-translate-y-0.5">
            <p className="text-3xl font-black mb-0.5">{value}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide opacity-75 leading-tight">{label}</p>
        </div>
    )
}

export default StatPill