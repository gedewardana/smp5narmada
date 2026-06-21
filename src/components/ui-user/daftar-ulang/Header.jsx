import React from 'react'
import { FileText, FileCheck } from 'lucide-react'

function Header() {
    return (
        <div>

            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <FileCheck className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Ulang PMB</h1>
            </div>
            <p className="text-gray-600">Pendaftaran Ulang Penerimaan Murid Baru SMP Negeri 5 Narmada.</p>
        </div>
    )
}

export default Header