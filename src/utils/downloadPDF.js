import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export async function downloadPDF(ref, fileName) {
    try {
        const element = ref.current

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: 794,
            width: 794,

            // Override style agar tidak pakai OKLCH dan tampilkan elemen print-only
            onclone: (doc) => {
                const style = doc.createElement("style")
                style.innerHTML = `
                    .print-only {
                        display: block !important;
                    }
                    * {
                        color: #000 !important;
                        background-color: #fff !important;
                        border-color: #000 !important;
                    }
                `
                doc.head.appendChild(style)
            }
        })

        const imgData = canvas.toDataURL("image/png")

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        })

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight)
        pdf.save(fileName)

    } catch (err) {
        console.error("Error generating PDF:", err)
        alert("Gagal membuat PDF. Silakan coba lagi.")
    }
}