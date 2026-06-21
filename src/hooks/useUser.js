import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

// ─── Fetcher ──────────────────────────────────────────────────────────────────
const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Gagal mengambil data pengguna");
    }
    return res.json();
};

/**
 * useUser Hook
 * Mengelola logika bisnis untuk daftar user dan aksi tanpa ID spesifik.
 * - getUsers       : SWR GET /api/users — ambil daftar dengan filter (admin)
 * - createUserAdmin: PUT /api/users    — buat user oleh admin (role & status_akun bisa diatur)
 * - registerUser   : POST /api/users   — registrasi publik (hanya nama, email, password)
 *
 * Untuk operasi per-ID (update, delete, get by ID), gunakan useUsersID.
 */
export function useUser() {
    const [isLoading, setIsLoading] = useState(false);

    // ─── Get All Users (SWR) ──────────────────────────────────────────────────
    const getUsers = (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value);
            }
        });
        const url = `/api/admin/users${params.toString() ? `?${params.toString()}` : ""}`;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { data, error, isLoading: swrLoading, mutate } = useSWR(url, fetcher, {
            keepPreviousData: true,
        });

        return { data, error, isLoading: swrLoading, mutate };
    };

    // ─── Create User oleh Admin ───────────────────────────────────────────────
    /**
     * Membuat user baru dengan role & status_akun yang bisa diatur.
     * Memanggil PUT /api/users → createUserByAdmin service.
     * @param {Object} form - { nama_lengkap, email, password, role, status_akun }
     */
    const createUserAdmin = async (form) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Gagal membuat pengguna.");
                return { success: false };
            }

            toast.success("Pengguna berhasil ditambahkan!");
            return { success: true, data: data.data };
        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan jaringan.");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Register User (Publik) ───────────────────────────────────────────────
    /**
     * Registrasi publik — hanya nama_lengkap, email, password.
     * Role & status_akun menggunakan default (USER / AKTIF).
     * @param {Object} form
     * @param {Function} setErrors - setter untuk error validasi
     * @param {Function} onSuccess - callback setelah sukses
     */
    const registerUser = async (form, setErrors, onSuccess) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error) toast.error(data.error);
                if (data.errors && setErrors) setErrors(data.errors);
                return { success: false };
            }

            toast.success("Register berhasil! Silakan masuk.");
            if (onSuccess) onSuccess();
            return { success: true };
        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan jaringan.");
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Get User Summary (SWR) ───────────────────────────────────────────────
    const getUserSummary = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { data, error, isLoading: swrLoading, mutate } = useSWR("/api/admin/users/summary", fetcher);
        return { data, error, isLoading: swrLoading, mutate };
    };

    return {
        getUsers,
        createUserAdmin,
        registerUser,
        getUserSummary,
        isLoading,
    };
}
