import { useState } from 'react';
import Swal from 'sweetalert2';

/**
 * Hook khusus untuk menangani proses pengiriman (submit) form pendaftaran
 * secara clean dan reusable.
 * Terhubung langsung ke rute `POST /api/pendaftaran/form`
 */
export function useForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const submitForm = async (id_pendaftaran, formData) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Swal.fire({
        //     title: 'Menyimpan Data...',
        //     text: 'Mohon tunggu sebentar',
        //     allowOutsideClick: false,
        //     didOpen: () => {
        //         Swal.showLoading();
        //     }
        // });

        try {
            if (!id_pendaftaran) {
                throw new Error("ID Pendaftaran tidak ditemukan. Pastikan Anda sudah login.");
            }

            const response = await fetch('/api/pendaftaran/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_pendaftaran: Number(id_pendaftaran),
                    // Semua data input (identitas, keluarga, dsb) dibungkus ke identitas_peserta_didik
                    identitas_peserta_didik: formData
                }),
            });

            const result = await response.json();
            
            if (!response.ok || !result.success) {
                if (result.errors) {
                    console.error("Validation Errors:", result.errors);
                    throw new Error(`${result.message} Detail: ${JSON.stringify(result.errors)}`);
                }
                throw new Error(result.message || 'Terjadi kesalahan pada server saat menyimpan data.');
            }

            setSuccessMessage(result.message || "Data berhasil disimpan!");
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Berhasil!',
            //     text: result.message || 'Data berhasil disimpan dengan aman.',
            //     confirmButtonText: 'OK',
            //     confirmButtonColor: '#059669',
            // });
            return result.data; // Mengembalikan data hasil upsert dari backend

        } catch (err) {
            console.error("Gagal menyimpan form:", err);
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: err.message || 'Terjadi kesalahan pada server.',
            });
            throw err; // Lempar error agar komponen UI bisa menangkapnya jika perlu
        } finally {
            setIsLoading(false);
        }
    };

    const submitPersyaratan = async (id_pendaftaran, berkasData) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Swal.fire({
        //     title: 'Menyimpan Persyaratan...',
        //     text: 'Mohon tunggu sebentar',
        //     allowOutsideClick: false,
        //     didOpen: () => {
        //         Swal.showLoading();
        //     }
        // });

        try {
            if (!id_pendaftaran) {
                throw new Error("ID Pendaftaran tidak ditemukan. Pastikan Anda sudah login.");
            }

            const response = await fetch('/api/pendaftaran/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_pendaftaran: Number(id_pendaftaran),
                    berkas_persyaratan: berkasData
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                if (result.errors) {
                    console.error("Validation Errors:", result.errors);
                    throw new Error(`${result.message} Detail: ${JSON.stringify(result.errors)}`);
                }
                throw new Error(result.message || 'Terjadi kesalahan pada server saat menyimpan data.');
            }

            setSuccessMessage(result.message || "Persyaratan berhasil disimpan!");
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Berhasil!',
            //     text: result.message || 'Persyaratan berhasil disimpan dengan aman.',
            //     confirmButtonText: 'OK',
            //     confirmButtonColor: '#059669',
            // });
            return result.data; // Mengembalikan data hasil upsert dari backend

        } catch (err) {
            console.error("Gagal menyimpan persyaratan:", err);
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: err.message || 'Terjadi kesalahan pada server.',
            });
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        submitForm,
        submitPersyaratan,
        isLoading,
        error,
        successMessage,
        // Fungsi pembantu jika UI ingin mereset state notifikasi
        resetStatus: () => {
            setError(null);
            setSuccessMessage(null);
        }
    };
}