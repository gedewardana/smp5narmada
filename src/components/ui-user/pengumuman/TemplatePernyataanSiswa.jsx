import React from 'react'

/**
 * TemplatePernyataanSiswa - Surat Pernyataan Siswa
 * Size: A4 (210mm x 297mm)
 * Font: Times New Roman
 */
function TemplatePernyataanSiswa({ data }) {
    return (
        <div className="surat-pernyataan-siswa-container">
            {/* Title */}
            <h1 className="title">SURAT PERNYATAAN SISWA SMP NEGERI 5 NARMADA</h1>

            {/* Form Data */}
            <p className="intro">Yang bertanda tangan di bawah ini:</p>

            <table className="data-table">
                <tbody>
                    <tr>
                        <td className="number">1.</td>
                        <td className="label">Nama Lengkap</td>
                        <td className="dots">:...................................................................................................</td>
                    </tr>
                    <tr>
                        <td className="number">2.</td>
                        <td className="label">Tempat/Tanggal Lahir</td>
                        <td className="dots">:...................................................................................................</td>
                    </tr>
                    <tr>
                        <td className="number">3.</td>
                        <td className="label">Alamat</td>
                        <td className="dots">:...................................................................................................</td>
                    </tr>
                </tbody>
            </table>

            {/* Statement */}
            <p className="statement-title">
                <strong>MENYATAKAN</strong> dengan penuh kesadaran bahwa selama menjadi siswa, saya sanggup dan bersedia untuk menjaga nama baik sekolah dan mentaati semua peraturan yang berlaku di SMP Negeri 5 Narmada.
            </p>

            <p className="statement-text">
                Apabila saya melanggar hal-hal tersebut diatas maka saya sanggup untuk menerima sanksi sesuai dengan ketentuan. ( Peraturan/tata tertib terlampir ).
            </p>

            <p className="statement-text">
                Demikian surat pernyataan ini saya buat dengan kesadaran dan tanpa ada pakaan atau tekanan dari pihak manapun dan untuk bisa dipergunakan dimana mestnya.
            </p>

            {/* Signature Section */}
            <div className="signature-section">
                <div className="signature-left">
                    <p className="signature-label1">Mengetahui/Menyetujui Orang Tua/Wali</p>
                    <div className="signature-space-1"></div>
                    <p className="signature-line-1"></p>
                </div>

                <div className="signature-right">
                    <p className="signature-place">Narmada,........................2025</p>
                    <p className="signature-label2">Yang Membuat Pernyataan</p>
                    <div className="signature-space"></div>
                    <p className="signature-line"></p>
                </div>
            </div>

            {/* Kepala Sekolah Section */}
            <div className="kepala-sekolah-section">
                <p className="kepala-label">Mengetahui,</p>
                <p className="kepala-title">Kepala Sekolah</p>
                <div className="kepala-space"></div>
                <p className="kepala-name"><u>KADAR KENCANA, S.Pd</u></p>
                <p className="kepala-nip">Pembina IV/a</p>
                <p className="kepala-nip">NIP. 19750803 200701 1 015</p>
            </div>

            {/* Styles */}
            <style jsx>{`
                .surat-pernyataan-siswa-container {
                    width: 794px;
                    min-height: 1123px;
                    padding: 60px 80px;
                    background: white;
                    font-family: 'Times New Roman', Times, serif;
                    position: relative;
                    box-sizing: border-box;
                    margin: 0 auto;
                }

                /* Title */
                .title {
                    text-align: center;
                    font-size: 14pt;
                    font-weight: bold;
                    margin: 0 0 30px 0;
                }

                /* Intro */
                .intro {
                    margin: 20px 0 15px 0;
                }

                /* Data Table */
                .data-table {
                    width: 100%;
                    margin: 0 0 25px 0;
                    border-collapse: collapse;
                }

                .data-table td {
                    padding: 3px 0;
                    vertical-align: top;
                }

                .number {
                    width: 30px;
                    padding-left: 20px;
                }

                .label {
                    width: 180px;
                }

                /* Statement */
                .statement-title {
                    text-align: justify;
                    margin: 25px 0 15px 0;
                }

                .statement-text {
                    text-align: justify;
                    margin: 15px 0;
                }

                /* Signature Section */
                .signature-section {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 40px;
                    margin-bottom: 40px;
                }

                .signature-left, .signature-right {
                    width: 45%;
                }

                .signature-left {
                    text-align: left;
                }

                .signature-right {
                    text-align: right;
                }

                .signature-label2 {
                    margin: 0 0 5px 0;
                    
                   
                }

                .signature-label1 {
                    margin: 0 0 30px 0;
                    margin-top: 35px;
                }

                .signature-place {
                    margin: 0 0 5px 0;
                }

                .signature-space {
                    height: 60px;
                }
                    
                
                .signature-space-1 {
                    height: 30px;
                }

                .signature-line {
                    margin: 5px 0;
                    border-top: 1px solid black;
                    display: inline-block;
                    min-width: 200px;
                }
                
                .signature-line-1 {
                    margin-top: -10px;
                    border-top: 1px solid black;
                    display: inline-block;
                    min-width: 200px;
                    
                }

                /* Kepala Sekolah */
                .kepala-sekolah-section {
                    text-align: center;
                    margin-top: 30px;
                }

                .kepala-label {
                    margin: 0 0 5px 0;
                }

                .kepala-title {
                    margin: 0 0 10px 0;
                }

                .kepala-space {
                    height: 60px;
                }

                .kepala-name {
                    margin: 5px 0 2px 0;
                    font-weight: bold;
                }

                .kepala-nip {
                    margin: 2px 0;
                }

                /* Print Styles */
                @media print {
                    .surat-pernyataan-siswa-container {
                        margin: 0;
                        padding: 25mm 30mm;
                        box-shadow: none;
                    }

                    // @page {
                    //     size: A4;
                    //     margin: 0;
                    // }
                }
            `}</style>
        </div>
    )
}

export default TemplatePernyataanSiswa