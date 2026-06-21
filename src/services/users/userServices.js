


import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
import { createPendaftaran } from "@/services/pendaftaran/pendaftaranServices";

export async function registerUser({ nama_lengkap, email, password }) {
    // Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (existing) {
        throw new Error("Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            nama_lengkap,
            email,
            password: hashedPassword,
            // role dan status_akun akan pakai default: USER & AKTIF
        },
        select: {
            id_pengguna: true,
            nama_lengkap: true,
            email: true,
            role: true,
            status_akun: true,
            dibuat_pada: true,
        },
    });

    // try...catch? Ini adalah Best Practice (Praktik Terbaik). Jika seandainya Admin lupa membuka jadwal pendaftaran, User tetap diizinkan untuk membuat akun (Register sukses). Hanya saja, draf pendaftarannya tidak akan terbentuk sampai jadwalnya benar-benar dibuka.

    // ✨ OTOMATISASI: Buat file pendaftaran (DRAFT) untuk user ini
    try {
        await createPendaftaran({ id_pengguna: user.id_pengguna });
    } catch (error) {
        // Jika gagal (misal: jadwal belum dibuka/belum dibuka oleh Admin), kita abaikan saja 
        // agar proses register akun tetap berhasil. User bisa cek statusnya di Dashboard.
        console.warn(`Pembuatan draf pendaftaran otomatis dilewati untuk user ${user.id_pengguna}:`, error.message);
    }

    return user;
}



// ─── Get by ID ────────────────────────────────────────────────────────────────

export async function getUserById(id_pengguna) {
    const user = await prisma.user.findUnique({
        where: { id_pengguna },
        select: {
            id_pengguna: true,
            nama_lengkap: true,
            email: true,
            role: true,
            status_akun: true,
            dibuat_pada: true,
            diperbaharui_pada: true,
        },
    });

    if (!user) {
        throw new Error("User tidak ditemukan");
    }

    return user;
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateUser(id_pengguna, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id_pengguna } });
    if (!user) throw new Error("User tidak ditemukan");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Password lama salah");

    return prisma.user.update({
        where: { id_pengguna },
        data: {
            password: await bcrypt.hash(newPassword, 10),
            diperbaharui_pada: new Date(),
        },
    });
}

// ─── — ubah status jadi NONAKTIF) ────────────────────────

export async function updateNonaktifUser(id_pengguna) {
    const user = await prisma.user.update({
        where: { id_pengguna },
        data: {
            status_akun: "NONAKTIF",
            diperbaharui_pada: new Date(),
        },
        select: {
            id_pengguna: true,
            status_akun: true,
        },
    });

    return user;
}

// ─── Get All, filter ──────────────────────────────────────────

export async function getAllUsers({ role, status_akun, search, page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const where = {
        ...(role && { role }),
        ...(status_akun && { status_akun }),
        ...(search && {
            OR: [
                { nama_lengkap: { contains: search } },
                { email: { contains: search } },
            ]
        })
    };

    const [data, total] = await prisma.$transaction([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            select: {
                id_pengguna: true,
                nama_lengkap: true,
                email: true,
                role: true,
                status_akun: true,
                dibuat_pada: true,
                pendaftaran_pendaftaran_id_penggunaTopengguna: {
                    select: {
                        status_pendaftaran: true,
                    },
                    take: 1,
                    orderBy: {
                        id_pendaftaran: 'desc'
                    }
                }
            },
            orderBy: { dibuat_pada: "desc" },
        }),
        prisma.user.count({ where }),
    ]);

    // Transform agar status_pendaftaran lebih mudah dibaca di frontend
    const transformedData = data.map(u => ({
        ...u,
        status_pendaftaran: u.pendaftaran_pendaftaran_id_penggunaTopengguna?.[0]?.status_pendaftaran || null
    }));

    return {
        data: transformedData,
        meta: {
            total,
            page,
            limit,
            total_pages: Math.ceil(total / limit),
        },
    };
}


// update dan create user untuk admin

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createUserByAdmin({ nama_lengkap, email, password, status_akun }) {
    // Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (existing) {
        throw new Error("Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            nama_lengkap,
            email,
            password: hashedPassword,
            role: 'USER',
            status_akun: status_akun || 'AKTIF',
        },
        select: {
            id_pengguna: true,
            nama_lengkap: true,
            email: true,
            role: true,
            status_akun: true,
            dibuat_pada: true,
        },
    });

    // ✨ OTOMATISASI: Buat file pendaftaran (DRAFT) untuk user ini
    try {
        await createPendaftaran({ id_pengguna: user.id_pengguna });
    } catch (error) {
        console.warn(`Pembuatan draf pendaftaran otomatis dilewati untuk user ${user.id_pengguna}:`, error.message);
    }

    return user;
}

/**
 * Update user oleh Admin (tanpa password lama)
 */
export async function updateUserAdmin(id_pengguna, updateData) {
    const { nama_lengkap, email, role, status_akun, password } = updateData;

    const data = {
        diperbaharui_pada: new Date(),
    };

    if (nama_lengkap) data.nama_lengkap = nama_lengkap;
    if (email) data.email = email;
    if (role) data.role = role;
    if (status_akun) data.status_akun = status_akun;

    if (password) {
        data.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    return prisma.user.update({
        where: { id_pengguna },
        data,
    });
}


// delete user
export async function deleteUserAdmin(id_pengguna, adminId) {
    // 1. Cegah hapus diri sendiri
    if (id_pengguna === adminId) {
        throw new Error("Anda tidak dapat menghapus akun Anda sendiri");
    }

    // 2. Cek apakah user memiliki pendaftaran yang sudah SUBMITTED
    const checkSubmitted = await prisma.pendaftaran.findFirst({
        where: {
            id_pengguna,
            status_pendaftaran: "SUBMITTED",
        },
    });

    if (checkSubmitted) {
        throw new Error("User tidak dapat dihapus karena pendaftaran sudah berstatus SUBMITTED");
    }

    return prisma.user.delete({
        where: { id_pengguna },
    });
}

// perhitungan summary card
export async function getUserSummary() {
    const [total, admin, user, inactive] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.user.count({
            where: {
                status_akun: { in: ['NONAKTIF', 'DIBLOKIR'] }
            }
        }),
    ]);

    return {
        total,
        admin,
        user,
        inactive
    };
}