import React from 'react'
import { TrendingUp, TrendingDown, Users, CheckCircle, Clock, XCircle } from 'lucide-react'

function QuickStats() {
    const stats = [
        {
            title: 'Pendaftaran Hari Ini',
            value: '24',
            isPositive: true,
            icon: Users,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            trendColor: 'text-green-600'
        },
        {
            title: 'Verifikasi Selesai',
            value: '187',
            isPositive: true,
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            trendColor: 'text-green-600'
        },
        {
            title: 'Menunggu Verifikasi',
            value: '15',
            isPositive: true,
            icon: Clock,
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600',
            trendColor: 'text-green-600'
        },
        {
            title: 'Perlu Perbaikan',
            value: '8',
            icon: XCircle,
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600',
            trendColor: 'text-red-600'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon


                return (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendColor}`}>

                                <span>{stat.trend}</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default QuickStats