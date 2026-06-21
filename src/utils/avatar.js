/**
 * Helpers for Avatar generation and styling
 */

export const AVATAR_COLORS = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-rose-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
]

/**
 * Get initials from a full name (max 2 characters)
 * @param {string} name 
 * @returns {string}
 */
export function getInitials(name) {
    if (!name) return '?'
    return name.trim().split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

/**
 * Get a consistent random gradient color based on the name string
 * @param {string} name 
 * @returns {string} Tailwind gradient class
 */
export function getAvatarGradient(name = '') {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
