import React from 'react'
import { FileText } from 'lucide-react'

function Header() {
    return (
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pendaftaran PMB</h1>
                    <p className="text-gray-600 text-sm">Penerimaan Murid Baru SMP Negeri 5 Narmada.</p>
                </div>
            </div>
        </div>
    )
}

export default Header