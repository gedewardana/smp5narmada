import { useState, useEffect } from 'react';

/**
 * Hook untuk mengambil SATU jenis data master
 * Penggunaan: const { data: agamaList, isLoading } = useMaster('agama');
 */
export function useMaster(type) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!type) return;
            
            setIsLoading(true);
            try {
                const response = await fetch(`/api/master?type=${type}`);
                const result = await response.json();
                
                if (!response.ok || !result.success) {
                    throw new Error(result.message || `Gagal mengambil data ${type}`);
                }
                
                setData(result.data || []);
            } catch (err) {
                console.error(`Error useMaster(${type}):`, err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [type]);

    return { data, isLoading, error };
}

/**
 * Hook untuk mengambil BANYAK data master sekaligus (Sangat direkomendasikan untuk Form)
 * Penggunaan: 
 * const { masterData, isLoading } = useMultipleMaster(['agama', 'jenis_kelamin', 'transportasi']);
 * 
 * Lalu gunakan:
 * masterData.agama, masterData.jenis_kelamin, dsb.
 */
export function useMultipleMaster(types = []) {
    const [masterData, setMasterData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            if (!types || types.length === 0) return;
            
            setIsLoading(true);
            const newData = {};
            
            try {
                await Promise.all(types.map(async (type) => {
                    const response = await fetch(`/api/master?type=${type}`);
                    const result = await response.json();
                    if (result.success) {
                        newData[type] = result.data;
                    } else {
                        newData[type] = [];
                    }
                }));
                setMasterData(newData);
            } catch (err) {
                console.error("Error fetching multiple master data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        // Hindari infinite loop dengan mengubah array menjadi string koma saat useEffect dependency
        fetchAll();
    }, [types.join(',')]);

    return { masterData, isLoading };
}
