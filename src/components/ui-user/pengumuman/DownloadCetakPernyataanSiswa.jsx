'use client'

import { useRef } from 'react'
import { Download, Printer } from 'lucide-react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import TemplatePernyataanSiswa from './TemplatePernyataanSiswa'
import ButtonReasuble from '@/components/buttonreasuble/ButtonReasuble'

export default function DownloadPernyataanSiswa({ data, onPrint }) {
    const templateRef = useRef()

    const handleDownload = async () => {
        try {
            const element = templateRef.current

            // Convert to canvas
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false
            })

            // Create PDF (A4 Portrait)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const imgData = canvas.toDataURL('image/png')
            const pdfWidth = 210
            const pdfHeight = 297

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`Surat-Pernyataan-Siswa-${data?.nomor_pendaftaran || 'Draft'}.pdf`)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Gagal membuat PDF. Silakan coba lagi.')
        }
    }

    return (
        <>
            {/* Hidden Template for PDF */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <div ref={templateRef}>
                    <TemplatePernyataanSiswa data={data} />
                </div>
            </div>

            <div className='flex gap-2'>
                {/* Download Button */}
                <ButtonReasuble
                    onClick={handleDownload}
                    variant="success"
                    size="sm"
                >
                    <Download className="w-5 h-5" />
                    Download PDF
                </ButtonReasuble>

                <ButtonReasuble
                    onClick={onPrint}
                    variant="primary"
                    size="sm"
                >
                    <Printer className="w-5 h-5" />
                    Print
                </ButtonReasuble>
            </div>
        </>
    )
}