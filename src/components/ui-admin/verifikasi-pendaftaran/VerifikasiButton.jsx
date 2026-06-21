'use client'

import { CheckCircle2, Pencil } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const statusVerifikasi = {
    MENUNGGU_VERIFIKASI: 'MENUNGGU_VERIFIKASI',
    VERIFIKASI: 'DIVERIFIKASI',
    TOLAK: 'DITOLAK',
    PERLU_PERBAIKAN: 'PERLU_PERBAIKAN'
}

export default function VerifikasiButton({
    status,
    onClick,
    href,
    className = '',
    children
}) {
    const verifikasiEdit = status === statusVerifikasi.MENUNGGU_VERIFIKASI

    const label = verifikasiEdit ? 'Verifikasi' : 'Edit Verif'
    // const Icon = verifikasiEdit ? CheckCircle2 : Pencil
    const variant = verifikasiEdit ? "verifikasi" : "secondary"

    const content = children || (
        <>
            {/* <Icon className="w-3.5 h-3.5" /> */}
            <span>{label}</span>
        </>
    )

    if (href) {
        return (
            <Button 
            variant={variant} 
            className={className}
            size='sm' 
            asChild>
                <Link href={href}>
                    {content}
                </Link>
            </Button>
        )
    }

    return (
        <Button 
        variant={variant} 
        onClick={onClick} 
        className={className}
        size='sm'>
            {content}
        </Button>
    )
}