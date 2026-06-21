'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'


function TemplateTTD({ readOnly = false }) {
  const [signature, setSignature] = useState(null)

  useEffect(() => {
    // Periksa tanda tangan yang tersimpan saat pemasangan.
    const savedSig = localStorage.getItem('ttd_signature')
    if (savedSig) {
      setSignature(savedSig)
    }
  }, [])

  return (

    <div className="ttd">
      <p className="tanggal">
        Yogyakarta, 12 Januari 2026
      </p>

      <p className="responden">
        Responden,
      </p>

      <div className="spasi-ttd relative flex items-center justify-center">
        {signature ? (
          <div className="relative w-40 h-24">
            <Image
              src={signature}
              alt="Tanda Tangan"
              fill
              className="object-contain"
            />
            <button
              onClick={() => {
                if (confirm('Hapus tanda tangan?')) {
                  localStorage.removeItem('ttd_signature')
                  setSignature(null)
                }
              }}
              className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-200"
              title="Hapus Tanda Tangan"
            >
              ✕
            </button>
          </div>
        ) : (
          <Link
            href="/user/dashboard/pendaftaran/SignatureCanvas"
            className="text-sm font-semibold text-blue-600 border-2 border-dashed border-blue-300 rounded-lg px-4 py-3 hover:bg-blue-50 transition-colors inline-block"
          >
            ✍️ Klik disini untuk Tanda Tangan
          </Link>
        )}
      </div>

      <p className='line1 mt-4'>_________________________</p>

      <div className='Nama'>
        Nama:
      </div>

      <style jsx>{`
            .ttd {
  width: 100%;
  text-align: center;
  margin-top: 40px;
  font-family: "Times New Roman", serif;
  color: #000;
}

.tanggal {
  margin-bottom: 24px;
}

.responden {
  margin-bottom: 20px;
  margin-top: -20px;
}

.spasi-ttd {
  min-height: 80px; /* ruang tanda tangan yang fleksibel */
  margin: 10px 0;
}

.line1 {
  margin-bottom: 10px;
}

.Nama {
  margin: -15px 160px 0 0;
}

            `}</style>
    </div>


  )
}

export default TemplateTTD