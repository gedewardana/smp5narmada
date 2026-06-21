'use client'

import { useState } from 'react'
import ProfileCard from '@/components/profile/ProfileCard'
import { User } from 'lucide-react'
import ModalChangePassword from '@/components/profile/ModalChangePassword'
import Swal from "sweetalert2"

export default function ProfilePage() {
    const [openChangePassword, setOpenChangePassword] = useState(false)

    return (
        <div className="space-y-6">
            {/* Header */}
            {/* <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <User className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                    <p className="text-gray-600 text-sm">Informasi akun dan data pengguna.</p>
                </div>
            </div> */}


            {/* Profile Card */}
            <div className=''>
                <ProfileCard
                    onOpenChangePassword={() => setOpenChangePassword(true)}

                />
            </div>
            {/* Modal Change Password */}
            <ModalChangePassword
                isOpen={openChangePassword}
                onClose={() => setOpenChangePassword(false)} />
        </div>

    )
}
