'use client';

import Swal from 'sweetalert2';
import { useAuth } from '@/hooks/useAuth';

export function useLogout() {
    const { logout } = useAuth();

    const logoutWithConfirm = async () => {
        const result = await Swal.fire({
            title: 'Yakin ingin keluar?',
            text: 'Anda akan logout dari akun ini.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, keluar',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) return;

        await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Logout berhasil',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
        });

        await logout();
    };

    return logoutWithConfirm;
}