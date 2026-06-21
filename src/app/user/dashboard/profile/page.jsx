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
           

            {/* Profile Card */}
            <ProfileCard
                onOpenChangePassword={() => setOpenChangePassword(true)}

            />
            {/* Modal Change Password */}
            <ModalChangePassword
                isOpen={openChangePassword}
                onClose={() => setOpenChangePassword(false)} />
        </div>

    )
}
