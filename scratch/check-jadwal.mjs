import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const active = await prisma.jadwal_pmb.findFirst({
        where: { status_jadwal: 'DIBUKA', is_active: true }
    });
    console.log("ACTIVE JADWAL:", active);
    
    if (active) {
        const sekarang = new Date();
        const mulai = new Date(active.pendaftaran_mulai);
        const batasAkhir = new Date(active.pendaftaran_selesai);
        batasAkhir.setHours(23, 59, 59, 999);
        
        console.log("sekarang:", sekarang);
        console.log("mulai:", mulai);
        console.log("batasAkhir:", batasAkhir);
        
        if (sekarang < mulai) console.log("ERROR: Masa pendaftaran belum dimulai");
        if (sekarang > batasAkhir) console.log("ERROR: Batas waktu telah berakhir");
    }
}
check().catch(console.error).finally(() => prisma.$disconnect());
