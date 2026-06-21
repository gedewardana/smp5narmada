import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Gunakan service_role key (server-side only) agar melewati RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file')

        if (!file || typeof file === 'string') {
            return Response.json({ success: false, message: 'File tidak ditemukan' }, { status: 400 })
        }

        // Validasi ukuran (maks 2MB)
        if (file.size > 2 * 1024 * 1024) {
            return Response.json({ success: false, message: 'Ukuran file maksimal 2MB' }, { status: 400 })
        }

        // Validasi tipe file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
        if (!allowedTypes.includes(file.type)) {
            return Response.json({ success: false, message: 'Tipe file tidak diizinkan. Gunakan JPG, PNG, atau PDF.' }, { status: 400 })
        }

        const ext = file.name.split('.').pop()
        const idPendaftaran = session.user?.id_pendaftaran ?? 'unknown'
        const fileName = `prestasi/${idPendaftaran}_${Date.now()}.${ext}`

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { data, error } = await supabaseAdmin.storage
            .from('bukti-prestasi')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true,
            })

        if (error) {
            return Response.json({ success: false, message: error.message }, { status: 500 })
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('bukti-prestasi')
            .getPublicUrl(data.path)

        return Response.json({ success: true, url: publicUrl })

    } catch (err) {
        return Response.json({ success: false, message: err.message }, { status: 500 })
    }
}
