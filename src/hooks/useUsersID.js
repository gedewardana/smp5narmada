import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// ─── Fetcher ──────────────────────────────────────────────────────────────────
const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal mengambil data pengguna");
    }
    return res.json();
};

/**
 * useUsersID Hook
 * Mengelola semua operasi yang membutuhkan ID pengguna spesifik:
 * - getUserById   : SWR GET /api/users/[id]
 * - updateUser    : PATCH /api/users/[id] → updateUserAdmin (tanpa password lama)
 * - deleteUser    : DELETE /api/users/[id] → soft delete (status jadi NONAKTIF)
 */
export function useUsersID() {
    const [isLoading, setIsLoading] = useState(false);

    // ─── Get User By ID (SWR) ─────────────────────────────────────────────────
    /**
     * Mengambil data satu pengguna berdasarkan ID.
     * @param {number|null} id - ID pengguna, null = tidak fetch
     */
    const getUserById = (id) => {
        const url = id ? `/api/users/${id}` : null;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { data, error, isLoading: swrLoading, mutate } = useSWR(url, fetcher);

        return { data, error, isLoading: swrLoading, mutate };
    };

    // ─── Update User oleh Admin ───────────────────────────────────────────────
    /**
     * Memperbarui data user (nama, email, role, status_akun, password opsional).
     * Memanggil PATCH /api/users/[id] → updateUserAdmin (tidak butuh password lama).
     * @param {number} id_pengguna
     * @param {Object} form - { nama_lengkap?, email?, role?, status_akun?, password? }
     */
    const updateUser = async (id_pengguna, form) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${id_pengguna}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Gagal memperbarui pengguna.");
                return { success: false };
            }

            toast.success("Data pengguna berhasil diperbarui!");
            return { success: true, data: data.data };
        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan jaringan.");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Update Status ke NONAKTIF (Soft Delete) ──────────────────────────
    /**
     * Mengubah status_akun menjadi NONAKTIF.
     * Memanggil DELETE /api/users/[id] → deleteUser service.
     * @param {number} id_pengguna
     */
    const updateNonaktifUser = async (id_pengguna) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${id_pengguna}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Gagal menonaktifkan pengguna.");
                return { success: false };
            }

            toast.success("Pengguna berhasil dinonaktifkan.");
            return { success: true, data: data.data };
        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan jaringan.");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Delete User Permanen (Hard Delete) ──────────────────────────
    /**
     * Menghapus user secara permanen dari database.
     * Memanggil DELETE /api/users/[id]?mode=hard
     * @param {number} id_pengguna
     */
    const deleteUserAdmin = async (id_pengguna) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin ingin menghapus pengguna ini secara permanen?",
            text: "Tindakan ini tidak dapat dibatalkan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#94a3b8",
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) {
            return { success: false };
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${id_pengguna}?mode=hard`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Gagal menghapus pengguna.");
                return { success: false };
            }

            toast.success("Pengguna berhasil dihapus permanen.");
            return { success: true };
        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan jaringan.");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Update Password User ─────────────────────────────────────────────────
    /**
     * Memperbarui password user.
     * Memanggil PUT /api/users/[id]
     * @param {number} id_pengguna
     * @param {Object} form - { oldPassword, newPassword }
     */
    const updatePassword = async (id_pengguna, form) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/users/${id_pengguna}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Gagal mengubah password.");
                return { success: false };
            }

            toast.success("Password berhasil diubah!");
            return { success: true };
        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan jaringan.");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        getUserById,
        updateUser,
        updatePassword,
        updateNonaktifUser,
        deleteUserAdmin,
        isLoading,
    };
}
