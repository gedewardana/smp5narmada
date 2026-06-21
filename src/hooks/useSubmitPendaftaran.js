import { useState } from 'react';
import { useSWRConfig } from 'swr';

/**
 * useSubmitPendaftaran Hook
 * Mengelola state loading dan integrasi API untuk finalisasi pendaftaran.
 */
export function useSubmitPendaftaran() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { mutate } = useSWRConfig();

    const submitForm = async (id_pendaftaran) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/user/submitted', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_pendaftaran }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Gagal melakukan submit pendaftaran');
            }

            // Memperbarui data dashboard user (refresh cache secara global)
            // Asumsi API endpoint untuk dashboard adalah /api/user/dashboard
            mutate('/api/user/dashboard');
            
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        submitForm,
        isSubmitting,
        error
    };
}
