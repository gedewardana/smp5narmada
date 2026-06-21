import useSWR from 'swr'
import { useMemo } from 'react'

// Fetcher standard
const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData.message || 'Terjadi kesalahan saat mengambil detail pendaftaran';
        console.error(`[usePendaftaranID] Fetch gagal → ${res.status} ${res.statusText} | URL: ${url} | Pesan: ${message}`);
        throw new Error(message);
    }
    return res.json()
}

/**
 * Custom hook SWR untuk mengambil SEMUA detail dari satu pendaftaran secara individual.
 */
export function usePendaftaranID(id) {
    const url = id ? `/api/pendaftaran/${id}` : null;

    const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
    })

    // Gunakan useMemo agar referensi objek 'data' tetap stabil
    // Ini mencegah infinite loop di useEffect milik page.jsx
    const detailData = useMemo(() => {
        if (!data?.data) return null;
        const iden = data.data.identitas_peserta_didik;

        let parsedSkippedSteps = [];
        try {
            if (data.data.skipped_steps) {
                parsedSkippedSteps = JSON.parse(data.data.skipped_steps);
            }
        } catch (e) {
            console.error("Gagal parsing skipped_steps:", e);
        }

        return {
            ...data.data,
            skipped_steps: parsedSkippedSteps,
            // 1. Tab Identitas
            identitas: iden ? {
                ...iden,
                tanggal_lahir: iden.tanggal_lahir ? new Date(iden.tanggal_lahir).toISOString().split('T')[0] : '',
                jenis_kelamin: iden.jenis_kelamin?.nama || '-',
                agama: iden.agama?.nama || '-',
                kebutuhan_khusus: iden.kebutuhan_khusus?.nama || '-',
                jenis_tinggal: iden.jenis_tinggal?.nama || '-',
                transportasi: iden.transportasi?.nama || '-',
                asal_sekolah: iden.sekolah_asal?.nama_sekolah || '-',
                npsn_asal: iden.sekolah_asal?.npsn || '-',
                // Extract IDs for cascading dropdowns
                id_provinsi: iden.kelurahan?.kecamatan?.kabupaten?.id_provinsi || null,
                id_kabupaten: iden.kelurahan?.kecamatan?.id_kabupaten || null,
                id_kecamatan: iden.kelurahan?.id_kecamatan || null,
                id_kelurahan: iden.id_kelurahan || null,
                kode_pos: iden.kelurahan?.kode_pos || '',

                wilayah: {
                    kelurahan: iden.kelurahan?.kelurahan_desa || '-',
                    kecamatan: iden.kelurahan?.kecamatan?.nama_kecamatan || '-',
                    kabupaten: iden.kelurahan?.kecamatan?.kabupaten?.nama_kabupaten || '-',
                    provinsi: iden.kelurahan?.kecamatan?.kabupaten?.provinsi?.nama_provinsi || '-',
                },
                alamat: iden.alamat_tempat_tinggal,
                email: iden.email_pribadi || '-',
            } : null,

            // 2. Tab Orang Tua
            ayah: iden?.ayah ? {
                ...iden.ayah,
                kebutuhan_khusus: iden.ayah.kebutuhan_khusus?.nama || '-',
                pekerjaan: iden.ayah.pekerjaan?.nama || '-',
                pendidikan: iden.ayah.pendidikan?.nama || '-',
                penghasilan: iden.ayah.penghasilan_bulanan?.rentang_penghasilan || '-',
            } : null,

            ibu: iden?.ibu ? {
                ...iden.ibu,
                kebutuhan_khusus: iden.ibu.kebutuhan_khusus?.nama || '-',
                pekerjaan: iden.ibu.pekerjaan?.nama || '-',
                pendidikan: iden.ibu.pendidikan?.nama || '-',
                penghasilan: iden.ibu.penghasilan_bulanan?.rentang_penghasilan || '-',
            } : null,

            wali: iden?.wali ? {
                ...iden.wali,
                nama_wali: iden.wali.nama,
                kebutuhan_khusus: iden.wali.kebutuhan_khusus?.nama || '-',
                pekerjaan: iden.wali.pekerjaan?.nama || '-',
                pendidikan: iden.wali.pendidikan?.nama || '-',
                penghasilan: iden.wali.penghasilan_bulanan?.rentang_penghasilan || '-',
            } : null,

            periodik: iden?.periodik ? {
                ...iden.periodik,
                jarak_sekolah: iden.periodik.jarak_tempat_tinggal_kesekolah,
                waktu_tempuh: iden.periodik.waktu_tempuh_berangkat_sekolah,
                jumlah_saudara: (iden.saudara_kandung || 0) + (iden.saudara_tiri || 0) + (iden.saudara_angkat || 0)
            } : null,

            prestasi: iden?.prestasi?.map(p => ({
                ...p,
                nama: p.nama_prestasi,
                tahun: p.tahun_prestasi,
                jenis: p.jenis_prestasi,
                tingkat: p.tingkat_prestasi,
                penyelenggara: p.penyelenggara_prestasi,
            })) || [],

            berkas_persyaratan: data.data.berkas_persyaratan || [],
            status_daftar_ulang: data.data.pengumuman?.daftar_ulang?.status_daftar_ulang,
        };
    }, [data]);

    return {
        data: detailData,
        error: error || (data?.success === false ? data.message : null),
        isLoading,
        mutate
    }
}
