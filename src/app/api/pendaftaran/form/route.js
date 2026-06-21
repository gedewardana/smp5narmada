import { upsertFormIdentitas, upsertFormPersyaratan } from "@/services/pendaftaran/formServices";
import { NextResponse } from "next/server";
import { fullPendaftaranSchema, persyaratanPayloadSchema } from "@/utils/FormValidation";

export async function POST(request) {
    try {
        // Ambil payload dari frontend
        const body = await request.json();
        const { id_pendaftaran, identitas_peserta_didik, berkas_persyaratan } = body;

        // Validasi input dasar
        if (!id_pendaftaran) {
            return NextResponse.json(
                { success: false, message: "ID Pendaftaran tidak dikirimkan." },
                { status: 400 }
            );
        }

        // ==========================================
        // 1. BLOK LOGIKA UNTUK BERKAS PERSYARATAN
        // ==========================================
        if (berkas_persyaratan) {
            // Validasi Zod untuk persyaratan
            const validationResult = persyaratanPayloadSchema.safeParse(body);
            
            if (!validationResult.success) {
                return NextResponse.json({
                    success: false,
                    message: "Validasi data persyaratan gagal.",
                    errors: validationResult.error.flatten().fieldErrors
                }, { status: 400 });
            }

            const cleanData = validationResult.data;
            
            // Panggil formServices
            const result = await upsertFormPersyaratan({
                id_pendaftaran: cleanData.id_pendaftaran,
                berkas_persyaratan: cleanData.berkas_persyaratan
            });

            return NextResponse.json(
                { 
                    success: true, 
                    message: "Data persyaratan berhasil disimpan dengan aman.",
                    data: result
                },
                { status: 200 }
            );
        }

        // ==========================================
        // 2. BLOK LOGIKA UNTUK IDENTITAS PESERTA
        // ==========================================
        if (identitas_peserta_didik) {
            // Validasi Zod untuk identitas dkk
            const validationResult = fullPendaftaranSchema.safeParse(body);
            
            if (!validationResult.success) {
                return NextResponse.json({
                    success: false,
                    message: "Validasi data gagal. Periksa kembali isian formulir Anda.",
                    errors: validationResult.error.format() // Menggunakan format() agar error nested terlihat
                }, { status: 400 });
            }

            const cleanData = validationResult.data;

            // Panggil formServices
            const result = await upsertFormIdentitas({ 
                id_pendaftaran: cleanData.id_pendaftaran, 
                identitas_peserta_didik: cleanData.identitas_peserta_didik 
            });

            return NextResponse.json(
                { 
                    success: true, 
                    message: "Data formulir berhasil disimpan dengan aman.",
                    data: result
                },
                { status: 200 }
            );
        }

        // Jika payload tidak memiliki identitas maupun persyaratan
        return NextResponse.json(
            { success: false, message: "Data formulir (identitas_peserta_didik / berkas_persyaratan) tidak ditemukan pada payload." },
            { status: 400 }
        );

    } catch (error) {
        console.error("API PENDAFTARAN FORM ERROR:", error.message);

        // Prisma: Unique constraint violation (P2002)
        if (error.code === 'P2002') {
            // error.meta.target bisa berupa array ['nik'] atau string 'nik'
            const raw = error.meta?.target
            const field = Array.isArray(raw) ? raw[0] : (raw ?? 'data')
            const FIELD_LABELS = {
                nik: 'NIK',
                nisn: 'NISN',
                no_reg_akta_kelahiran: 'No Reg Akta',
                // no_kk: 'Nomor KK',
                email: 'Email',
            }
            const fieldLabel = FIELD_LABELS[field] ?? field.toUpperCase()
            return NextResponse.json(
                { success: false, message: `${fieldLabel} yang Anda masukkan sudah terdaftar oleh pendaftar lain. Harap periksa kembali.` },
                { status: 409 }
            );
        }

        // Cek jika error terjadi karena status pendaftaran bukan DRAFT
        const isClientError = error.message.includes("tidak dapat diubah karena status");

        return NextResponse.json(
            { success: false, message: error.message },
            { status: isClientError ? 403 : 500 }
        );
    }
}
