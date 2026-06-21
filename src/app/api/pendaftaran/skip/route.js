import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const body = await request.json();
        const { id_pendaftaran, step_key } = body;

        if (!id_pendaftaran || !step_key) {
            return NextResponse.json(
                { success: false, message: "ID Pendaftaran dan step_key diperlukan." },
                { status: 400 }
            );
        }

        // Ambil data pendaftaran yang ada
        const pendaftaran = await prisma.pendaftaran.findUnique({
            where: { id_pendaftaran: Number(id_pendaftaran) },
            select: { skipped_steps: true }
        });

        if (!pendaftaran) {
            return NextResponse.json(
                { success: false, message: "Data pendaftaran tidak ditemukan." },
                { status: 404 }
            );
        }

        // Parsing skipped_steps yang sudah ada
        let skippedSteps = [];
        try {
            if (pendaftaran.skipped_steps) {
                skippedSteps = JSON.parse(pendaftaran.skipped_steps);
            }
        } catch (e) {
            // Jika parsing error, biarkan array kosong
        }

        // Tambahkan step_key jika belum ada
        if (!skippedSteps.includes(step_key)) {
            skippedSteps.push(step_key);

            // Update ke DB
            await prisma.pendaftaran.update({
                where: { id_pendaftaran: Number(id_pendaftaran) },
                data: {
                    skipped_steps: JSON.stringify(skippedSteps)
                }
            });
        }

        return NextResponse.json(
            { 
                success: true, 
                message: "Step berhasil ditandai sebagai di-skip.",
                skipped_steps: skippedSteps
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("API SKIP STEP ERROR:", error.message);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
