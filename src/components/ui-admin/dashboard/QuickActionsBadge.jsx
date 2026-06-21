const QuickActionsBadge = ({ count, type = 'default' }) => {
    if (!count) return null

    const colors = {

        info: 'bg-blue-100 text-blue-600'
    }

    return (
        <span className={`
            absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse-ring

            ${colors[type] || colors.info}
        `}>
            {count}
        </span>
    )
}

export default QuickActionsBadge