'use client'

import React, { useRef, useState } from 'react'
import SignaturePad from 'react-signature-canvas'

function SignatureCanvas({ onSave }) {
    const sigPad = useRef({})
    const [trimmedDataURL, setTrimmedDataURL] = useState(null)

    const clear = () => {
        sigPad.current.clear()
        setTrimmedDataURL(null)
    }

    const save = () => {
        setTrimmedDataURL(sigPad.current.getTrimmedCanvas().toDataURL('image/png'))
    }

    return (
        <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-gray-700">Tanda Tangan Digital</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:bg-white transition-colors w-full h-[200px] relative">
                <SignaturePad
                    ref={sigPad}
                    canvasProps={{
                        className: 'w-full h-full cursor-crosshair'
                    }}
                />

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        type="button"
                        onClick={clear}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                    >
                        Hapus
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (sigPad.current.isEmpty()) {
                                alert('Silakan tanda tangan terlebih dahulu!')
                                return
                            }
                            // Get base64 string
                            const dataURL = sigPad.current.getTrimmedCanvas().toDataURL('image/png')
                            // Execute parent callback
                            if (onSave) onSave(dataURL)
                        }}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Simpan
                    </button>
                </div>
            </div>

            <p className="text-xs text-gray-500">
                Silakan tanda tangan pada area di atas menggunakan mouse atau layar sentuh, lalu klik <strong>Simpan</strong>.
            </p>
        </div>
    )
}

export default SignatureCanvas