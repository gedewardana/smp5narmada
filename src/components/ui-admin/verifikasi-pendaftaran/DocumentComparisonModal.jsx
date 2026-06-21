'use client'
import React, { useState, useEffect, useRef } from 'react'
import { X, Maximize2, FileText, ChevronDown, ZoomIn, ZoomOut, RotateCw, RefreshCcw } from 'lucide-react'

function DocumentComparisonModal({ documents = [], onClose }) {
    const [leftDocIndex, setLeftDocIndex] = useState(0)
    const [rightDocIndex, setRightDocIndex] = useState(documents.length > 1 ? 1 : 0)

    // State Resize
    const [leftWidth, setLeftWidth] = useState(50) // Persentase
    const [isResizing, setIsResizing] = useState(false)
    const containerRef = useRef(null)

    const leftDoc = documents[leftDocIndex]
    const rightDoc = documents[rightDocIndex]

    // Viewer Component (Sama seperti sebelumnya)
    const SingleViewer = ({ doc }) => {
        const [zoom, setZoom] = useState(100)
        const [rotation, setRotation] = useState(0)

        // Drag to pan states
        const [position, setPosition] = useState({ x: 0, y: 0 })
        const [isDragging, setIsDragging] = useState(false)
        const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

        useEffect(() => {
            setZoom(100)
            setRotation(0)
            setPosition({ x: 0, y: 0 })
        }, [doc])

        // Reset posisi saat zoom kembali ke 100%
        useEffect(() => {
            if (zoom <= 100) {
                setPosition({ x: 0, y: 0 })
            }
        }, [zoom])

        if (!doc) return <div className="flex items-center justify-center h-full text-gray-400">Pilih dokumen</div>

        const isImage = doc.path_file?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        const isPdf = doc.path_file?.match(/\.pdf$/i)

        const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300))
        const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25))
        const handleRotate = () => setRotation(prev => (prev + 90) % 360)
        const handleReset = () => {
            setZoom(100)
            setRotation(0)
            setPosition({ x: 0, y: 0 })
        }

        // --- DRAG TO PAN LOGIC ---
        const handleDragStart = (clientX, clientY) => {
            if (zoom > 100) {
                setIsDragging(true)
                setDragStart({ x: clientX - position.x, y: clientY - position.y })
            }
        }
        const handleDragMove = (clientX, clientY) => {
            if (isDragging && zoom > 100) {
                setPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y })
            }
        }
        const handleDragEnd = () => setIsDragging(false)

        const handleMouseDown = (e) => handleDragStart(e.clientX, e.clientY)
        const handleMouseMove = (e) => handleDragMove(e.clientX, e.clientY)
        const handleTouchStart = (e) => {
            if (e.touches.length === 1) handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
        }
        const handleTouchMove = (e) => {
            if (isDragging && e.touches.length === 1) handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
        }

        return (
            <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                {isImage && (
                    <div className=" bg-gray-200 absolute top-4 left-1/2 -translate-x-1/2 rounded-lg p-1.5 flex items-center gap-1 z-20 transition-opacity opacity-0 group-hover:opacity-100">
                        <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600"><ZoomOut className="w-4 h-4" /></button>
                        <span className="text-xs font-medium w-12 text-center text-gray-700">{zoom}%</span>
                        <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600"><ZoomIn className="w-4 h-4" /></button>
                        <div className="w-px h-4 bg-gray-300 mx-1" />
                        <button onClick={handleRotate} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600"><RotateCw className="w-4 h-4" /></button>
                        <button onClick={handleReset} className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-red-500"><RefreshCcw className="w-4 h-4" /></button>
                    </div>
                )}


                <div 
                    className={`w-full h-full overflow-hidden flex items-center justify-center p-4 select-none ${zoom > 100 ? (isDragging ? 'touch-none cursor-grabbing' : 'touch-none cursor-grab') : ''}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleDragEnd}
                    onTouchCancel={handleDragEnd}
                >
                    {isImage ? (
                        <div 
                            style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100}) rotate(${rotation}deg)` }} 
                            className={`pointer-events-auto origin-center ${isDragging ? '' : 'transition-transform duration-200 ease-out'}`}
                        >
                            <img src={doc.path_file} alt={doc.nama_file} draggable={false} className="max-w-none shadow-lg origin-center" style={{ maxHeight: zoom === 100 ? '100%' : 'none', maxWidth: zoom === 100 ? '100%' : 'none' }} />
                        </div>
                    ) : isPdf ? (
                        <iframe src={doc.path_file} className="w-full h-full" title={doc.nama_file} />
                    ) : (
                        <div className="text-center p-6"><FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-500">Pratinjau tidak tersedia</p></div>
                    )}
                </div>
            </div>
        )
    }

    // --- Logic Resize ---
    const startResizing = React.useCallback((e) => {
        e.preventDefault() // Mencegah seleksi teks saat mulai drag
        setIsResizing(true)
    }, [])

    const stopResizing = React.useCallback(() => {
        setIsResizing(false)
    }, [])

    const resize = React.useCallback(
        (e) => {
            if (isResizing && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect()
                const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
                if (newWidth >= 20 && newWidth <= 80) setLeftWidth(newWidth)
            }
        },
        [isResizing]
    )

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize)
            window.addEventListener('mouseup', stopResizing)
            // Tambahkan cursor grabbing ke body agar konsisten saat mouse keluar area
            document.body.style.cursor = 'col-resize'
        } else {
            document.body.style.cursor = 'default'
        }
        return () => {
            window.removeEventListener('mousemove', resize)
            window.removeEventListener('mouseup', stopResizing)
            document.body.style.cursor = 'default'
        }
    }, [isResizing, resize, stopResizing])


    return (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col">
            {/* Header */}
            <div className="flex-none flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shadow-sm z-10">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Maximize2 className="w-5 h-5 text-blue-600" />
                        Mode Perbandingan Dokumen
                    </h2>
                    <p className="text-xs text-gray-500">Bandingkan dua dokumen secara bersebelahan</p>
                </div>
                <div className="flex items-center gap-3">
                    {leftWidth !== 50 && (
                        <button onClick={() => setLeftWidth(50)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors flex items-center gap-2 border border-blue-100 bg-blue-50/50">
                            <RefreshCcw className="w-4 h-4" />
                            <span className="text-sm font-medium">Reset Tata Letak</span>
                        </button>
                    )}
                    <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors flex items-center gap-2">
                        <span className="text-sm font-medium">Tutup</span><X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Split View Content */}
            <div
                ref={containerRef}
                className="flex-1 overflow-hidden flex flex-col md:flex-row relative select-none"
            >
                {/* Left Panel */}
                <div
                    className="flex flex-col h-full overflow-hidden bg-gray-50 p-4 relative"
                    style={{ width: `${leftWidth}%` }}
                >
                    <div className="flex-none mb-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Dokumen Kiri</label>
                        <div className="relative">
                            <select value={leftDocIndex} onChange={(e) => setLeftDocIndex(Number(e.target.value))} className="w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-blue-500 outline-none">
                                {documents.map((doc, idx) => <option key={idx} value={idx}>{doc.jenis_berkas} - {doc.nama_file}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    {/* Pointer events none saat resizing */}
                    <div className={`flex-1 overflow-hidden ${isResizing ? 'pointer-events-none' : ''}`}>
                        <SingleViewer doc={leftDoc} />
                    </div>

                    {/* --- INVISIBLE RESIZE HANDLE --- */}
                    {/* Ini adalah "Area Aktif" di sisi kanan panel kiri */}
                    <div
                        onMouseDown={startResizing}
                        onDoubleClick={() => setLeftWidth(50)}
                        className="hidden md:block absolute top-0 right-0 h-full w-2 cursor-col-resize z-50 hover:bg-blue-500/10 active:bg-blue-500/20 transition-colors"
                        style={{ right: '-4px' }} // Offset agar berada tepat di tengah garis batas
                        title="Geser untuk mengubah ukuran. Klik ganda untuk reset."
                    />
                </div>

                {/* Right Panel */}
                <div className="flex flex-col h-full overflow-hidden bg-gray-50 p-4 flex-1 border-l border-gray-200">
                    <div className="flex-none mb-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Dokumen Kanan</label>
                        <div className="relative">
                            <select value={rightDocIndex} onChange={(e) => setRightDocIndex(Number(e.target.value))} className="w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-blue-500 outline-none">
                                {documents.map((doc, idx) => <option key={idx} value={idx}>{doc.jenis_berkas} - {doc.nama_file}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className={`flex-1 overflow-hidden ${isResizing ? 'pointer-events-none' : ''}`}>
                        <SingleViewer doc={rightDoc} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DocumentComparisonModal
