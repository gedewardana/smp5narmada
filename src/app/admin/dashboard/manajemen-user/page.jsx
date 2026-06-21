'use client'
import React, { useState } from 'react'
import SummaryUser from '@/components/ui-admin/manajemen-user/SummaryUser'
import ListUser from '@/components/ui-admin/manajemen-user/ListUser'
import FilterUser from '@/components/ui-admin/manajemen-user/FilterUser'
import ModalUser from '@/components/ui-admin/manajemen-user/ModalUser'
import { useUser } from '@/hooks/useUser'
import { useUsersID } from '@/hooks/useUsersID'
import { useSession } from 'next-auth/react'
import { useSWRConfig } from 'swr'


export default function Page() {
  const { mutate: globalMutate } = useSWRConfig()
  const { data: session } = useSession()
  const currentUserId = session?.user?.id_pengguna

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [filters, setFilters] = useState({ search: '', status_akun: '' })

  const { getUsers, createUserAdmin, isLoading: createLoading } = useUser()
  const { updateUser, updateNonaktifUser, deleteUserAdmin, isLoading: actionLoading } = useUsersID()
  const { data, error, isLoading, mutate } = getUsers(filters)

  // Fungsi untuk refresh semua data (list & summary)
  const refreshData = () => {
    mutate() // Refresh list
    globalMutate('/api/admin/users/summary') // Refresh summary
  }

  const handleAddClick = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // ubah status jadi NONAKTIF
  const handleUpdateNonaktifClick = async (id_pengguna) => {
    const result = await updateNonaktifUser(id_pengguna)
    if (result.success) refreshData()
  }

  // Hapus permanen
  const handleDeleteClick = async (id_pengguna) => {
    const result = await deleteUserAdmin(id_pengguna)
    if (result.success) refreshData()
  }

  const handleModalSubmit = async (formData) => {
    let result;
    if (selectedUser) {
      // Edit mode: update via PATCH /api/users/[id] → updateUserAdmin
      result = await updateUser(selectedUser.id_pengguna, formData)
    } else {
      // Add mode: create via PUT /api/users → createUserByAdmin (supports role & status_akun)
      result = await createUserAdmin(formData)
    }

    if (result.success) {
      refreshData() // Refresh data
      handleModalClose()
    }
  }

  return (
    <div className="space-y-6">
      <SummaryUser />
      
      <div className=''>
        <FilterUser 
          onAddClick={handleAddClick} 
          onFilterChange={handleFilterChange}
        />
      </div>

      <ListUser 
        UserData={data?.data || []}
        onEditClick={handleEditClick}
        onUpdateNonaktifClick={handleUpdateNonaktifClick}
        onDeleteClick={handleDeleteClick}
        isLoading={isLoading}
        currentUserId={currentUserId}
      />

      <ModalUser 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        user={selectedUser}
        onSubmit={handleModalSubmit}
        loading={createLoading || actionLoading}
        currentUserId={currentUserId}
      />
    </div>
  )
}
 