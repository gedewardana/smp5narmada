'use client'

import { Button } from '../ui/button'
import { Loader2, X, Lock, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUsersID } from '@/hooks/useUsersID'
import { changePasswordSchema } from '@/utils/profileValidation'

export default function ModalChangePassword({ isOpen, onClose }) {
    const { user } = useAuth()
    const { updatePassword, isLoading } = useUsersID()
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    })

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
    }

    // Reset state setiap kali modal dibuka/ditutup
    useEffect(() => {
        if (isOpen) {
            setForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
            setErrors({})
            setShowPassword({ oldPassword: false, newPassword: false, confirmPassword: false })
        }
    }, [isOpen])

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
        }
    }

    const handleChangePassword = async () => {
        setErrors({})

        try {
            // Validate with Zod
            const validation = changePasswordSchema.safeParse(form)
            if (!validation.success) {
                const newErrors = {}
                validation.error.issues.forEach(issue => {
                    newErrors[issue.path[0]] = issue.message
                })
                setErrors(newErrors)
                return
            }

            const { success } = await updatePassword(user.id_pengguna, {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword
            })

            if (success) {
                setForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
                onClose()
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gray-600" />
                        <h2 className="text-base font-semibold text-gray-800">Ganti Password</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 transition">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {[
                        { name: "oldPassword", label: "Password Lama", placeholder: "Masukkan password lama" },
                        { name: "newPassword", label: "Password Baru", placeholder: "Minimal 6 karakter" },
                        { name: "confirmPassword", label: "Konfirmasi Password Baru", placeholder: "Ulangi password baru" },
                    ].map(({ name, label, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                            <div className="relative">
                                <input
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    type={showPassword[name] ? "text" : "password"}
                                    placeholder={placeholder}
                                    className={`w-full pl-3 pr-10 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility(name)}
                                    tabIndex="-1"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                >
                                    {showPassword[name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <Button variant="secondary" size="sm" onClick={onClose}>Batal</Button>
                    <Button variant="default" size="sm" onClick={handleChangePassword} disabled={isLoading}>
                        {isLoading && <Loader2 className="h-5 w-5 animate-spin mr-1" />}
                        <span>{isLoading ? "Menyimpan..." : "Simpan"}</span>
                    </Button>
                </div>

            </div>
        </div>
    )
}
