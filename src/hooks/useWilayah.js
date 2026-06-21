import { useState, useEffect } from 'react';

export function useWilayah(type, parentId = null) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Jika butuh parentId tapi belum ada (misal: belum pilih provinsi), jangan fetch kabupaten
        if ((type !== 'provinsi' && !parentId)) {
            setData([]);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Contoh: /api/wilayah?type=kabupaten&parentId=1
                const res = await fetch(`/api/wilayah?type=${type}${parentId ? `&parentId=${parentId}` : ''}`);
                const result = await res.json();
                setData(result.data || []);
            } catch (error) {
                console.error(`Gagal memuat ${type}`, error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [type, parentId]);

    return { data, isLoading };
}
