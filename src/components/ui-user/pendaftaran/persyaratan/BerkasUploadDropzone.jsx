'use client'

import { useState } from 'react'

/**
 * BerkasUploadDropzone - Drag & drop area untuk upload file
 */
function BerkasUploadDropzone({ jenisBerkas, onFileSelect, disabled }) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            onFileSelect(files[0])
        }
    }

    const handleFileInput = (e) => {
        const files = e.target.files
        if (files.length > 0) {
            onFileSelect(files[0])
        }
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
            `}
        >
            <input
                type="file"
                id={`file-${jenisBerkas}`}
                onChange={handleFileInput}
                className="hidden"
                accept="image/*,.pdf"
                disabled={disabled}
            />

            <label htmlFor={`file-${jenisBerkas}`} className="cursor-pointer">
                <div className="text-5xl mb-3">📁</div>
                <p className="text-gray-700 font-semibold mb-2">
                    Drag & Drop file di sini
                </p>
                <p className="text-gray-500 text-sm mb-4">
                    atau klik untuk memilih file
                </p>
                <p className="text-gray-400 text-xs">
                    Format: JPG, PNG, PDF (Max 2MB)
                </p>
            </label>
        </div>
    )
}

export default BerkasUploadDropzone