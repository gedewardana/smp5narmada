'use client'

import React, { useMemo } from 'react'
import DataTable from '../common/DataTable'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Trash2, Ban } from 'lucide-react'

export default function ListUser({ onEditClick, UserData, onUpdateNonaktifClick, onDeleteClick, isLoading, currentUserId }) {
  // Dummy Data based on model.db


  const columns = useMemo(() => [
    {
      accessorKey: 'nama_lengkap',
      header: 'Nama Lengkap',
      cell: ({ row }) => (
        <div className="font-bold text-slate-800">{row.getValue('nama_lengkap')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-slate-500 font-medium">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role')
        return (
          <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'} className="px-3 py-1 uppercase text-[10px] font-black tracking-wider">
            {role}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'status_akun',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status_akun')
        let variant = 'outline'
        if (status === 'AKTIF') variant = 'default'
        if (status === 'NONAKTIF') variant = 'secondary'
        if (status === 'DIBLOKIR') variant = 'destructive'

        return (
          <Badge variant={variant} className="px-3 py-1 uppercase text-[10px] font-black tracking-wider">
            {status}
          </Badge>
        )
      },
    },
    // {
    //   accessorKey: 'dibuat_pada',
    //   header: 'Dibuat Pada',
    //   cell: ({ row }) => {
    //     try {
    //       return (
    //         <div className="text-slate-400 text-xs font-semibold tabular-nums">
    //           {format(new Date(row.getValue('dibuat_pada')), 'dd MMM yyyy', { locale: id })}
    //         </div>
    //       )
    //     } catch (e) {
    //       return <div className="text-slate-300">-</div>
    //     }
    //   },
    // },

    // {
    //   accessorKey: 'status_pendaftaran',
    //   header: 'Status Pendaftaran',
    //   cell: ({ row }) => {
    //     const status = row.getValue('status_pendaftaran')
    //     const role = row.original.role

    //     // Jika Admin, tidak perlu status pendaftaran
    //     if (role === 'ADMIN') {
    //       return <div className="text-slate-300 text-[10px] font-black tracking-widest text-center">-</div>
    //     }

    //     if (!status) return <div className="text-slate-300 text-[10px] font-medium italic">Belum Ada</div>

    //     return (
    //       <Badge 
    //         variant={status === 'SUBMITTED' ? 'default' : 'outline'} 
    //         className={`px-2 py-0.5 uppercase text-[9px] font-bold tracking-wider ${status === 'DRAFT' ? 'border-slate-200 text-slate-400' : ''}`}
    //       >
    //         {status}
    //       </Badge>
    //     )
    //   },
    // },

    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const status = row.original.status_akun
        // const isSelf = row.original.id_pengguna === currentUserId

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEditClick?.(row.original)}
              disabled={row.original.role === 'ADMIN' && row.original.id_pengguna !== currentUserId}
              // className="rounded-lg h-8 text-[10px] font-bold uppercase tracking-wider disabled:cursor-not-allowed disabled:pointer-events-auto disabled:bg-slate-50 disabled:border-slate-200"
            >
               {row.original.role === 'ADMIN' && row.original.id_pengguna !== currentUserId ? (
                <Ban className="h-4 w-4 text-slate-300" />
              ) : (
                'Edit'
              )}
            </Button>


            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteClick?.(row.original.id_pengguna)}
              className="rounded-lg h-8 w-8 p-0 disabled:cursor-not-allowed disabled:pointer-events-auto"
              disabled={row.original.role === 'ADMIN'}
            >
              {row.original.role === 'ADMIN' ? (
                <Ban className="h-4 w-4 text-slate-300" />
              ) : (
                <Trash2 className="h-4 w-4 text-red-500" />
              )}
            </Button>
          </div>
        )
      },
    },
   
  ], [onEditClick, onUpdateNonaktifClick, onDeleteClick])

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={UserData}
        isLoading={isLoading}
        footerText="Manajemen Pengguna Sistem PMB"
        emptyTitle="Tidak Ada Pengguna"
        emptyDescription="Daftar pengguna masih kosong atau filter tidak sesuai."
      />
    </div>
  )
}
