'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  X, 
  UserPlus, 
  Mail, 
  Lock, 
  Shield, 
  Activity, 
  Loader2,
  User,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import { getAdminUserSchema } from '@/utils/userValidation'

export default function ModalUser({ isOpen, onClose, user, onSubmit, loading = false, currentUserId }) {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    role: 'USER',
    status_akun: 'AKTIF'
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const isEditMode = !!user
  const isTargetAdmin = isEditMode && user.role === 'ADMIN'
  const isCurrentUser = isEditMode && user.id_pengguna === currentUserId
  const isOtherAdmin = isTargetAdmin && !isCurrentUser

  useEffect(() => {
    if (user) {
      setFormData({
        nama_lengkap: user.nama_lengkap || '',
        email: user.email || '',
        password: '', // Password empty on edit unless user wants to change it
        role: user.role || 'USER',
        status_akun: user.status_akun || 'AKTIF'
      })
    } else {
      setFormData({
        nama_lengkap: '',
        email: '',
        password: '',
        role: 'USER',
        status_akun: 'AKTIF'
      })
    }
    setError('')
    setFieldErrors({})
  }, [user, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Bersihkan error field saat mengetik
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    // Validasi Zod
    const schema = getAdminUserSchema(isEditMode)
    const validation = schema.safeParse(formData)

    if (!validation.success) {
      const errors = {}
      validation.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message
      })
      setFieldErrors(errors)
      return
    }

    try {
      await onSubmit?.(formData)
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data.')
    }
  }

  const isChanged = () => {
    if (!isEditMode) return true; // Selalu aktif untuk tambah user baru
    
    return (
      formData.nama_lengkap !== (user.nama_lengkap || '') ||
      formData.email !== (user.email || '') ||
      formData.role !== (user.role || 'USER') ||
      formData.status_akun !== (user.status_akun || 'AKTIF') ||
      formData.password !== '' // Ada isi di field password berarti ada perubahan
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="relative shrink-0 h-32 bg-green-600 flex items-center px-8 overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 translate-x-1/4 -translate-y-1/4">
             <UserPlus className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex items-center gap-4 text-white">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              {isEditMode ? <User className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                {isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
              <p className="text-indigo-100 text-xs font-medium uppercase tracking-widest mt-0.5">
                {isEditMode ? 'Memperbarui profil akses' : 'Menyiapkan akses sistem'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto no-scrollbar" noValidate>
          
          <div className="grid grid-cols-1 gap-6">
            
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                <User className="w-3 h-3 text-indigo-500" /> Nama Lengkap
              </Label>
              <Input 
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                disabled={isOtherAdmin}
                placeholder="Masukkan nama lengkap..."
                className={`rounded-xl bg-slate-50 border-slate-100 h-11 focus:bg-white transition-all font-medium text-sm ${fieldErrors.nama_lengkap ? 'border-rose-300 ring-rose-500/10 ring-2' : ''} ${isOtherAdmin ? 'opacity-60 cursor-not-allowed bg-slate-200' : ''}`}
              />
              {fieldErrors.nama_lengkap && (
                <p className="text-[10px] text-rose-500 font-bold px-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.nama_lengkap}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                <Mail className="w-3 h-3 text-indigo-500" /> Alamat Email
              </Label>
              <Input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isOtherAdmin}
                placeholder="nama@contoh.com"
                className={`rounded-xl bg-slate-50 border-slate-100 h-11 focus:bg-white transition-all font-medium text-sm ${fieldErrors.email ? 'border-rose-300 ring-rose-500/10 ring-2' : ''} ${isOtherAdmin ? 'opacity-60 cursor-not-allowed bg-slate-200' : ''}`}
              />
              {fieldErrors.email && (
                <p className="text-[10px] text-rose-500 font-bold px-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password - Only show/require on add or optional on edit */}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                <Lock className="w-3 h-3 text-indigo-500" /> Kata Sandi
              </Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isOtherAdmin}
                  placeholder={isEditMode ? "Biarkan kosong jika tidak diubah" : "••••••••"}
                  className={`pr-10 rounded-xl bg-slate-50 border-slate-100 h-11 focus:bg-white transition-all font-medium text-sm ${fieldErrors.password ? 'border-rose-300 ring-rose-500/10 ring-2' : ''} ${isOtherAdmin ? 'opacity-60 cursor-not-allowed bg-slate-200' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isOtherAdmin}
                  tabIndex="-1"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none ${isOtherAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[10px] text-rose-500 font-bold px-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Role */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                  <Shield className="w-3 h-3 text-indigo-500" /> Hak Akses
                </Label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    disabled={true}
                    className="w-full h-11 pl-4 pr-10 appearance-none rounded-xl bg-slate-100 border-slate-200 text-slate-500 text-sm font-bold cursor-not-allowed opacity-80 outline-none"
                  >
                    <option value={formData.role}>{formData.role}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Shield className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold px-1">
                  *Role diatur otomatis oleh sistem.
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                  <Activity className="w-3 h-3 text-indigo-500" /> Status Akun
                </Label>
                <div className="relative">
                  <select
                    name="status_akun"
                    value={formData.status_akun}
                    onChange={handleChange}
                    disabled={isTargetAdmin}
                    className={`w-full h-11 pl-4 pr-10 appearance-none rounded-xl bg-slate-50 border-slate-100 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none ${fieldErrors.status_akun ? 'border-rose-300' : ''} ${isTargetAdmin ? 'opacity-60 cursor-not-allowed bg-slate-200 text-slate-400' : ''}`}
                  >
                    <option value="AKTIF">AKTIF</option>
                    <option value="NONAKTIF">NONAKTIF</option>
                    <option value="DIBLOKIR">DIBLOKIR</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Activity className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
                {isTargetAdmin && (
                  <p className="text-[10px] text-amber-600 font-bold px-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Tidak dapat mengubah status akun Admin
                  </p>
                )}
                {fieldErrors.status_akun && <p className="text-[10px] text-rose-500 font-bold px-1">{fieldErrors.status_akun}</p>}
              </div>
            </div>

          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in shake-1">
               <X className="w-4 h-4 flex-shrink-0" />
               <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button 
              type="button" 
              onClick={onClose}
              variant="outline"
              className=""
            >
              Batalkan
            </Button>
            <Button 
              type="submit"
              disabled={loading || (isEditMode && !isChanged())}
              className=""
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
              ) : (
                isEditMode ? 'Simpan' : 'Simpan'
              )}
            </Button>
          </div>

        </form>

      </div>
    </div>
  )
}
