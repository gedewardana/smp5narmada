import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


function EmptyKartu({ progress }) { // terima props progress
    return (
        <div className="flex items-center gap-8 py-16 px-4">
            {/* Gambar Kiri */}
            <div className="flex-shrink-0">
                <Image
                    src="/empty.png"
                    alt="Logo Lombok Barat"
                    width={300}
                    height={300}
                    className="opacity-80"
                />
            </div>

            {/* Content Kanan */}
            <div className="flex flex-col">
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Kartu Pendaftaran Belum Tersedia
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                    Kartu pendaftaran akan tersedia setelah Anda menyelesaikan dan submit semua data pendaftaran.
                </p>

                {/* Info Steps */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-black font-semibold mb-2">Langkah untuk mendapatkan kartu:</p>
                    <ul className="text-sm space-y-2 mt-2">
                        {/* Step 1: Formulir */}
                        <li className="flex items-start gap-2">
                            {progress?.pendaftaran ? (
                                <span className="text-green-600 font-bold text-lg leading-none">✓</span>
                            ) : (
                                <span className="text-blue-500 font-bold text-sm bg-blue-100 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                            )}

                            {progress?.pendaftaran ? (
                                <span className="text-green-700 font-medium decoration-green-700/30">
                                    Lengkapi semua data pendaftaran
                                </span>
                            ) : (
                                <Link href="/user/dashboard/pendaftaran" className="text-blue-600 hover:text-black hover:underline transition-colors">
                                    Lengkapi semua data pendaftaran
                                </Link>
                            )}
                        </li>

                        {/* Step 3: Submit */}
                        <li className="flex items-start gap-2">
                            {progress?.submitted ? (
                                <span className="text-green-600 font-bold text-lg leading-none">✓</span>
                            ) : (
                                <span className="text-blue-500 font-bold text-sm bg-blue-100 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                            )}

                            {progress?.submitted ? (
                                <span className="text-green-700 font-medium decoration-green-700/30">
                                    Submit pendaftaran
                                </span>
                            ) : (
                                <Link href="/user/dashboard/pendaftaran" className="text-blue-600 hover:text-black hover:underline transition-colors">
                                    Submit pendaftaran
                                </Link>
                            )}
                        </li>

                        {/* Step 4: Verifikasi */}
                        <li className="flex items-start gap-2">
                            {progress?.verifikasi ? (
                                <span className="text-green-600 font-bold text-lg leading-none">✓</span>
                            ) : (
                                <span className="text-blue-500 font-bold text-sm bg-blue-100 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">4</span>
                            )}

                            {progress?.verifikasi ? (
                                <span className="text-green-700 font-medium">
                                    Verifikasi dari panitia selesai
                                </span>
                            ) : (
                                <span className="text-gray-600">
                                    Tunggu verifikasi dari panitia
                                </span>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default EmptyKartu