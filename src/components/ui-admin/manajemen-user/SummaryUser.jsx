'use client'
import React from 'react'
import { Users, ShieldCheck, UserCircle, UserX } from 'lucide-react'
import SummaryCard from '@/components/reasublecomponents/SummaryCard'
import { useUser } from '@/hooks/useUser'

export default function SummaryUser() {
  const { getUserSummary } = useUser()
  const { data, isLoading } = getUserSummary()

  const UserData = [
    {
      label: 'Total Pengguna',
      value: data?.total || 0,
      icon: Users,
      variant: 'blue',
      trendUp: true,
      description: 'Total akun dalam database'
    },
    {
      label: 'Administrator',
      value: data?.admin || 0,
      icon: ShieldCheck,
      variant: 'rose',
      trendUp: true,
      description: 'Petugas & Admin Sistem'
    },
    {
      label: 'Pendaftar (User)',
      value: data?.user || 0,
      icon: UserCircle,
      variant: 'emerald',
      trendUp: true,
      description: 'Calon Siswa & Orang Tua'
    },
    {
      label: 'Akun Non-Aktif',
      value: data?.inactive || 0,
      icon: UserX,
      variant: 'amber',
      trendUp: false,
      description: 'Akun ditangguhkan/blokir'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {UserData.map((stat, index) => (
        <SummaryCard
          key={index}
          index={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          variant={stat.variant}
          trend={stat.trend}
          trendUp={stat.trendUp}
          description={stat.description}
        />
      ))}
    </div>
  )
}
