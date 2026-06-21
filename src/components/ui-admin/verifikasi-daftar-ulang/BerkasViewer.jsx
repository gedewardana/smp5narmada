'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { X, ZoomIn, ZoomOut, Download, Maximize2, ChevronLeft, ChevronRight, FileText, Loader2 } from 'lucide-react'
import { handleDownload as downloadFile } from '@/utils/downloadUtils'

function BerkasViewer({ berkas, onClose }) {
    const [zoom, setZoom] = useState(100)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    // Reset loading & zoom saat index berubah
    useEffect(() => {
        setIsLoading(true)
        setZoom(100)
    }, [currentIndex])

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowRight') handleNext()
            if (e.key === 'ArrowLeft') handlePrev()
            if (e.key === '+' || e.key === '=') handleZoomIn()
            if (e.key === '-') handleZoomOut()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentIndex, berkas])

    if (!berkas || berkas.length === 0) return null

    const currentBerkas = berkas[currentIndex]
    const isImage = currentBerkas.path_file?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    const isPdf = currentBerkas.path_file?.match(/\.pdf$/i)

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300))
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50))

    const handleDownload = () => {
        downloadFile(currentBerkas.path_file, currentBerkas.nama_file || 'download')
    }

    const handleNext = () => {
        if (currentIndex < berkas.length - 1) setCurrentIndex(p => p + 1)
    }

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(p => p - 1)
    }

    const handleImageLoad = () => setIsLoading(false)

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col h-screen w-screen overflow-hidden">

            {/* --- HEADER --- */}
            <div className="flex-none flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-md border-b border-white/10 text-white z-10">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-white/10 p-2 rounded-lg hidden sm:block">
                        {isImage ? <Maximize2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold truncate">{currentBerkas.jenis_berkas}</h3>
                        <p className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-md">
                            {currentBerkas.nama_file} • {currentIndex + 1}/{berkas.length}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Zoom Controls (Hidden on mobile for cleaner view) */}
                    <div className="hidden md:flex items-center bg-white/10 rounded-lg p-1 mr-2">
                        <button onClick={handleZoomOut} disabled={zoom <= 50} className="p-1.5 hover:bg-white/20 rounded disabled:opacity-30">
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-mono w-12 text-center">{zoom}%</span>
                        <button onClick={handleZoomIn} disabled={zoom >= 300} className="p-1.5 hover:bg-white/20 rounded disabled:opacity-30">
                            <ZoomIn className="w-4 h-4" />
                        </button>
                    </div>

                    <button onClick={handleDownload} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Download">
                        <Download className="w-5 h-5" />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/80 rounded-full transition-colors ml-1" title="Tutup (Esc)">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 relative w-full overflow-hidden flex items-center justify-center bg-transparent">

                {/* Navigation Arrows (Floating) */}
                {berkas.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all disabled:opacity-0 backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex === berkas.length - 1}
                            className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all disabled:opacity-0 backdrop-blur-sm"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Content Container with Scrolling for Zoom */}
                <div className="w-full h-full overflow-auto flex items-center justify-center p-4 sm:p-8" id="zoom-container">

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-0">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>
                    )}

                    <div
                        className="transition-transform duration-200 ease-out origin-center"
                        style={{ transform: `scale(${zoom / 100})` }}
                    >
                        {isImage ? (
                            <img
                                src={currentBerkas.path_file}
                                alt={currentBerkas.nama_file}
                                onLoad={handleImageLoad}
                                className={`max-h-[80vh] max-w-[90vw] object-contain shadow-2xl rounded-sm ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            />
                        ) : isPdf ? (
                            <iframe
                                src={currentBerkas.path_file}
                                onLoad={handleImageLoad}
                                className="w-[80vw] h-[80vh] bg-white rounded shadow-2xl"
                                title="PDF Viewer"
                            />
                        ) : (
                            <div className="bg-white rounded-xl p-10 text-center max-w-sm mx-auto shadow-2xl">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h4 className="text-gray-900 font-medium mb-2">Pratinjau Tidak Tersedia</h4>
                                <p className="text-sm text-gray-500 mb-6">Format file ini tidak didukung untuk pratinjau langsung.</p>
                                <button
                                    onClick={handleDownload}
                                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Download className="w-4 h-4" /> Download File
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- THUMBNAIL FOOTER --- */}
            {berkas.length > 1 && (
                <div className="flex-none bg-black/80 backdrop-blur-md border-t border-white/10 px-4 py-3 z-10">
                    <div className="flex justify-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {berkas.map((item, index) => {
                            const isThumbImage = item.path_file?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`
                                        group relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                                        ${index === currentIndex ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent opacity-60 hover:opacity-100'}
                                    `}
                                >
                                    {isThumbImage ? (
                                        <img
                                            src={item.path_file}
                                            className="w-full h-full object-cover"
                                            alt=""
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    {/* Tooltip on Hover */}
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white text-center py-0.5 truncate px-1">
                                        {item.jenis_berkas}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default BerkasViewer
