'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Plus, ChevronDown, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FilterUser({ onAddClick, onFilterChange }) {
  const [filters, setFilters] = React.useState({
    search: '',
    status_akun: ''
  })

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <Card className="border-0 bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100">
      <CardContent className="p-4 lg:p-5">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          {/* Search Input */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama lengkap atau email..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div className="flex w-full lg:w-auto items-center gap-3">
            {/* Status Dropdown */}
            <div className="relative flex-1 lg:flex-none">
              <select
                value={filters.status_akun}
                onChange={(e) => handleChange('status_akun', e.target.value)}
                className="appearance-none w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer outline-none transition-all"
              >
                <option value="">Semua Status</option>
                <option value="AKTIF">Aktif</option>
                <option value="NONAKTIF">Non-Aktif</option>
                <option value="DIBLOKIR">Diblokir</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Add User Button */}
            <Button 
              onClick={onAddClick}
              size='lg'
              variant='default'
            >
              <UserPlus className="w-4 h-4" />
              <span className="font-bold text-sm">Tambah User</span>
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
