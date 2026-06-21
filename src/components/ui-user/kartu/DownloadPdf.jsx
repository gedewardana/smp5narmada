'use client'

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Template from './Template'
import { useRef } from 'react'
import ButtonReusable from '@/components/buttonreasuble/ButtonReasuble'
import { Download } from 'lucide-react'

/**
 * DownloadPdf - Component untuk download kartu sebagai PDF
 */
function DownloadPdf({ data }) {
    const templateRef = useRef()

    const handleDownload = async () => {
        try {
            // Render template temporarily
            const element = templateRef.current

            // Convert to canvas
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false
            })

            // Create PDF (A4 Landscape, half page)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const imgData = canvas.toDataURL('image/png')

            // A4 landscape dimensions
            const pdfWidth = 297
            const pdfHeight = 210

            // Use half page (210mm x 148.5mm)
            pdf.addImage(imgData, 'PNG', 0, 0, 210, 148.5)

            // Download
            pdf.save(`Kartu-Pendaftaran-${data?.nomor_pendaftaran || 'Draft'}.pdf`)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Gagal membuat PDF. Silakan coba lagi.')
        }
    }

    return (
        <div>
            {/* Hidden Template for PDF */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <div ref={templateRef}>
                    <Template data={data} />
                </div>
            </div>

            {/* Download Button */}
            <ButtonReusable
                onClick={handleDownload}
                variant="success"
                size="sm"

            >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
            </ButtonReusable>
        </div>
    )
}

export default DownloadPdf