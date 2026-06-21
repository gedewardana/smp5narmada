'use client'

import { useSession } from 'next-auth/react'
import ProgressStepper from "@/components/ui-user/dashboard/ProgressStepper";
import StatsCard from "@/components/ui-user/dashboard/StatsCard";
import Welcome from '@/components/reasublecomponents/Welcome';
import { ShieldCheck } from 'lucide-react'

export default function DashboardPage() {
    // const { data: session } = useSession()
    // const userName = session?.user?.nama_lengkap || 'Calon Siswa'

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            
            <Welcome />

            {/* QUICK STATS - Overview Grid */}
            <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
                <StatsCard />
            </div>

            {/* DASHBOARD CONTENT GRID - Sidebar Info & Main Progress */}
            <div className="gap-8 animate-in slide-in-from-bottom-4 duration-700 delay-200">

                {/* MAIN CONTENT: Progress Section (8 Columns) */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-8 md:p-10">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Timeline Pendaftaran</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Lacak Status Langkah Anda</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                                <ShieldCheck className="w-3.5 h-3.5" /> Update Terakhir: Hari ini
                            </div>
                        </div>
                        <ProgressStepper />
                    </div>
                </div>

                {/* SIDEBAR: Other Info (4 Columns) */}
                <div className="lg:col-span-4 space-y-8">

                    {/* WIDGET: Jadwal Penting (Other Info) */}
                    {/* <JadwalPenting /> */}

                    {/* WIDGET: Pusat Bantuan (Support Center) */}
                    {/* <Bantuan /> */}
                </div>
            </div>

        </div>
    );
}
