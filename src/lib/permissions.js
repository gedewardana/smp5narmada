// src/lib/permissions.js
// Central permission config with dummy data for RBAC

// ========================================
// 1. MASTER DAFTAR MENU PANITIA PMB
// ========================================
export const DAFTAR_MENU = [
    {
        kode_menu: 'dashboard',
        label: 'Dashboard',
        icon: '🏠',
        href: '/panitia/dashboard',
        alwaysVisible: true, // Menu yang selalu tampil
    },
    {
        kode_menu: 'verifikasi_pendaftaran',
        label: 'Verifikasi Pendaftaran',
        icon: '📝',
        href: '/panitia/dashboard/verifikasi-pendaftaran',
    },
    {
        kode_menu: 'pengumuman',
        label: 'Pengumuman',
        icon: '📢',
        href: '/panitia/dashboard/kelolapengumuman',
    },
    {
        kode_menu: 'verifikasi_daftar_ulang',
        label: 'Verifikasi Daftar Ulang',
        icon: '🎓',
        href: '/panitia/dashboard/verifikasi-daftar-ulang',
    },
    {
        kode_menu: 'daftar_harian',
        label: 'Daftar Harian PMB',
        icon: '📊',
        href: '/panitia/dashboard/daftar-harian-pmb',
    },
    {
        kode_menu: 'laporan',
        label: 'Laporan PMB',
        icon: '📈',
        href: '/panitia/dashboard/reports',
    },
    {
        kode_menu: 'profile',
        label: 'Profile',
        icon: '👤',
        href: '/panitia/dashboard/profile',
        alwaysVisible: true,
    },
    {
        kode_menu: 'manajemen_jadwal_pmb',
        label: 'Manajemen Jadwal PMB',
        icon: '📅',
        href: '/panitia/dashboard/manajemen-jadwal-pmb',
    },
]

// ========================================
// 2. DUMMY USER DATA (PANITIA_PMB only)
// ========================================
export const DUMMY_PANITIA_USERS = [
    { id_pengguna: 2, nama_lengkap: 'Pak Hasan', email: 'hasan@smpn5narmada.sch.id' },
    { id_pengguna: 3, nama_lengkap: 'Bu Sari Dewi', email: 'sari@smpn5narmada.sch.id' },
    { id_pengguna: 4, nama_lengkap: 'Ahmad Ridwan', email: 'ahmad.ridwan@smpn5narmada.sch.id' },
]

// ========================================
// 3. DUMMY HAK AKSES PER USER
// ========================================
// Format: { id_pengguna → { kode_menu → 'READ' | 'FULL' } }
export const DUMMY_HAK_AKSES = {
    // Pak Hasan → Full Access semua menu
    2: {
        verifikasi_pendaftaran: 'FULL',
        pengumuman: 'FULL',
        verifikasi_daftar_ulang: 'FULL',
        daftar_harian: 'FULL',
        laporan: 'FULL',
    },
    // Bu Sari Dewi → Hanya bisa READ beberapa menu
    3: {
        verifikasi_pendaftaran: 'READ',
        laporan: 'READ',
    },
    // Ahmad Ridwan → Akses terbatas ke verifikasi & daftar harian
    4: {
        verifikasi_pendaftaran: 'FULL',
        daftar_harian: 'READ',
    },
}

// ========================================
// 4. HELPER FUNCTIONS
// ========================================

/**
 * Get filtered menu items for a specific user
 * @param {number} userId
 * @returns {Array} menu items user can access
 */
export function getMenuByUser(userId) {
    const userPermissions = DUMMY_HAK_AKSES[userId] || {}

    return DAFTAR_MENU.filter(menu => {
        // Always show menus marked as alwaysVisible
        if (menu.alwaysVisible) return true
        // Show menu if user has any permission for it
        return userPermissions[menu.kode_menu] != null
    }).map(menu => ({
        ...menu,
        level_akses: menu.alwaysVisible ? 'FULL' : (userPermissions[menu.kode_menu] || null),
    }))
}

/**
 * Get access level for a user on a specific menu
 * @param {number} userId
 * @param {string} kodeMenu
 * @returns {'FULL' | 'READ' | null}
 */
export function getAccessLevel(userId, kodeMenu) {
    const userPermissions = DUMMY_HAK_AKSES[userId] || {}
    return userPermissions[kodeMenu] || null
}

/**
 * Check if user has write (FULL) access to a menu
 * @param {number} userId
 * @param {string} kodeMenu
 * @returns {boolean}
 */
export function canWrite(userId, kodeMenu) {
    return getAccessLevel(userId, kodeMenu) === 'FULL'
}
