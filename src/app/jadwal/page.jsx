// 'use client'
// import React from 'react'
// import { useRouter } from 'next/navigation'
// import VisualTemlineJadwal from '@/components/ui-panitia/kelola-jadwal-pmb/VisualTemlineJadwal'

// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// export default function page() {
//     const jadwalData = {
//         id_jadwal: 1,
//         tahun_pelajaran: '2024/2025',
//         daya_tampung_murid: 150,
//         status_jadwal: 'DITUTUP',
//         pendaftaran_mulai: '2024-05-01',
//         pendaftaran_selesai: '2024-05-31',
//         pengumuman: '2024-06-15',
//         pendaftaran_ulang_mulai: '2024-06-16',
//         pendaftaran_ulang_selesai: '2024-06-25',
//         masa_pengenalan_mulai: '2024-07-10',
//         masa_pengenalan_selesai: '2024-07-15'
//     }
//     const router = useRouter()

//     const handleClose = () => {
//         router.push('/')
//     }
//     return (
//         <div className='pr-6 pl-6'>

//             {/* back*/}
//             <Tooltip>
//                 <TooltipTrigger asChild>
//                     <button
//                         onClick={handleClose}
//                         className="absolute top-4 left-4 z-50 hover:bg-gray-200 p-2 rounded-full">
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-6 w-6 text-gray-600"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"

//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M15 19l-7-7 7-7"
//                             />
//                         </svg>
//                     </button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                     Kembali
//                 </TooltipContent>
//             </Tooltip>

//             <div className=''>
//                 <VisualTemlineJadwal jadwalData={jadwalData} />
//             </div>
//         </div>
//     )
// }
