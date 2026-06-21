import useSWR from "swr";

const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Terjadi kesalahan saat mengambil data jadwal')
    }
    return res.json()
}

export function useJadwal(params = null) {
    let url = '/api/admin/jadwal';
    let id = null;

    if (typeof params === 'string' || typeof params === 'number') {
        id = params;
        url = `/api/admin/jadwal/${id}`;
    } else if (typeof params === 'object' && params !== null) {
        // Clean up empty params
        const validParams = {};
        Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
                validParams[key] = val;
            }
        });
        
        const query = new URLSearchParams(validParams).toString();
        if (query) url = `/api/admin/jadwal?${query}`;
    }

    const { data, error, isLoading, mutate } = useSWR(url, fetcher)
    
    const getJadwalById = async (idToFetch) => {
        const res = await fetch(`/api/admin/jadwal/${idToFetch}`)
        if (!res.ok) {
            const body = await res.json().catch(() => ({}))
            throw new Error(body?.error || 'Gagal mengambil data jadwal')
        }
        return await res.json()
    }
    

    if (id) {
        const updateJadwal = async (payload) => {
            const res = await fetch(`/api/admin/jadwal/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Gagal mengupdate jadwal')
            }
            const updated = await res.json()
            await mutate(updated, false) // update cache lokal tanpa revalidate
            return updated
        }

        return {
            data: data || null,
            error: error?.message || error,
            isLoading,
            mutate,
            updateJadwal,
            getJadwalById,
        }
    }

    const createJadwal = async (payload) => {
        const res = await fetch('/api/admin/jadwal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!res.ok) {
            const body = await res.json()
            const err = new Error(body?.error || 'Gagal membuat jadwal')
            err.errors = body?.errors || null
            throw err
        }
        const created = await res.json()
        await mutate()
        return created
    }

    const updateJadwal = async (id, payload) => {
        const res = await fetch(`/api/admin/jadwal/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!res.ok) {
            const body = await res.json()
            const err = new Error(body?.error || 'Gagal mengupdate jadwal')
            err.errors = body?.errors || null
            throw err
        }
        const updated = await res.json()
        await mutate()
        return updated
    }

    const deleteJadwal = async (id) => {
        const res = await fetch(`/api/admin/jadwal/${id}`, {
            method: 'DELETE',
        })
        if (!res.ok) {
            const body = await res.json()
            throw new Error(body?.error || 'Gagal menghapus jadwal')
        }
        await mutate()
        return true
    }

    return { 
        data: data?.data || [], 
        summary: data?.summary || null,
        error: error?.message || error, 
        isLoading, 
        mutate,
        createJadwal,
        updateJadwal,
        deleteJadwal,
        getJadwalById,
    }
}

