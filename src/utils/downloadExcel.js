import * as XLSX from 'xlsx'

export function downloadExcel(ref, fileName) {
    try {
        const element = ref.current
        
        // Cari elemen tabel di dalam komponen
        const table = element.querySelector('table')
        
        if (!table) {
            alert("Tabel tidak ditemukan untuk diekspor.")
            return
        }

        // Convert tabel HTML menjadi workbook Excel
        // SheetJS otomatis membaca thead, tbody, rowspan, dan colspan!
        const workbook = XLSX.utils.table_to_book(table, {
            sheet: "Rekap Data"
        })

        // Tulis dan download file excel
        XLSX.writeFile(workbook, fileName)

    } catch (err) {
        console.error("Error generating Excel:", err)
        alert("Gagal membuat file Excel. Silakan coba lagi.")
    }
}
