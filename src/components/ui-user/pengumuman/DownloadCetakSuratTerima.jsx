'use client'
import { Download, Printer } from 'lucide-react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import TemplateSuratTerima from './TemplateSuratTerima'
import ButtonReasuble from '@/components/buttonreasuble/ButtonReasuble'
import { useRef } from 'react'

/**
 * DownloadSuratTerima - Component untuk download surat sebagai PDF
 */
function DownloadSuratTerima({ data, onPrint }) {
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

            // Create PDF (A4)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const imgData = canvas.toDataURL('image/png')

            // A4 dimensions
            const pdfWidth = 210
            const pdfHeight = 297

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

            // Download
            const fileName = data?.hasil_seleksi === 'DITERIMA'
                ? `Surat-Penerimaan-${data?.nomor_pendaftaran || 'Draft'}.pdf`
                : `Surat-Penolakan-${data?.nomor_pendaftaran || 'Draft'}.pdf`

            pdf.save(fileName)
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
                    <TemplateSuratTerima data={data} />
                </div>
            </div>

            {/* Download Button */}

            <div className='flex items-center gap-2'>
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

        </div>
    )
}

export default DownloadSuratTerima
