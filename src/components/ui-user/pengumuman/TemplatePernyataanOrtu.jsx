import React from 'react'

/**
 * TemplatePernyataanOrtu - Surat Pernyataan Orang Tua/Wali
 * Size: A4 (210mm x 297mm)
 * Font: Times New Roman
 */
function TemplatePernyataanOrtu({ data }) {
    return (
        <div className="surat-pernyataan-ortu-container">
            {/* Title */}
            <h1 className="title">SURAT PERNYATAAN</h1>

            {/* Intro */}
            <p className="intro">Saya yang bertanda tangan di bawah ini:</p>

            {/* Parent/Guardian Data */}
            <table className="data-table">
                <tbody>
                    <tr>
                        <td className="number">1.</td>
                        <td className="label">Nama Lengkap</td>
                        <td className="dots">:...................................................................................................</td>
                    </tr>
                    <tr>
                        <td className="number">2.</td>
                        <td className="label">NIK</td>
                        <td className="dots">:...................................................................................................</td>
                    </tr>
                    <tr>
                        <td className="number">3.</td>
                        <td className="label">Tempat/Tanggal Lahir</td>
                        <td className="dots">:...................................................................................................</td>
                    </tr>
                    <tr>
                        <td className="number">4.</td>
                        <td className="label">Alamat Sesuai KK</td>
                        <td className="dots">:...................................................................................................</td>
                    </tr>
                </tbody>
            </table>

            {/* Student Info */}
            <p className="student-intro"><strong>Adalah orang tua/wali*) dari calon peserta didik:</strong></p>

            <table className="student-table">
                <tbody>
                    <tr>
                        <td className="student-label">Nama</td>
                        <td className="dots">:...................................................................................................</td>
                    </tr>
                    <tr>
                        <td className="student-label">Tempat dan Tanggal Lahir</td>
                        <td className="dots">:...................................................................................................</td>
                    </tr>
                    <tr>
                        <td className="student-label">Alamat Sesuai KK</td>
                        <td className="dots">:...................................................................................................</td>
                    </tr>
                </tbody>
            </table>

            {/* Statement */}
            <p className="statement-title"><strong>MENYATAKAN</strong> dengan sesungguhnya bahwa:</p>

            <table className="statement-list">
                <tbody>
                    <tr>
                        <td className='number1'>1.</td>
                        <td>
                            Alamat yang tercantum pada Kartu Keluarga (KK) adalah alamat yang menggambarkan kondisi sebenarnya domisili/tempat tinggal calon peserta didik saat ini.
                        </td>
                    </tr>
                    <tr>
                        <td className='number1'>2.</td>
                        <td>
                            Seluruh dokumen persyaratan pendaftaran yang disampaikan adalah benar sesuai dengan keterangan yang tercantum dalam dokumen yang digunakan
                        </td>
                    </tr>
                    <tr>
                        <td className='number1'>3.</td>
                        <td>
                            Semua dokumen disampaikan sifatnya otentik dan dapat dibuktikan keasliannya sesuai dengan ketentuan peraturan perundang-undangan
                        </td>
                    </tr>
                    <tr>
                        <td className='number1'>4.</td>
                        <td>
                            Jika dokumen yang disampaikan ternyata suatu saat terbukti palsu atau keterangan yang disampaikan tidak sesuai dengan ketentuan yang dipersyaratkan, maka saya bersedia diproses sesuai dengan ketentuan hukum yang berlaku dan menerima pembatalan atas penetapan diterimanya anak saya sebagai peserta didik baru.
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Closing */}
            <p className="closing">
                Demikian surat pernyataan ini dibuat untuk kepentingan PPDB SMP Negeri 5 Narmada di Kabupaten Lombok Barat Provinsi Nusa Tenggara Barat Tahun Ajaran 2025/2026
            </p>

            {/* Signature Section */}
            <div className="signature-section">
                <div className="signature-right">
                    <p className="signature-place">Narmada, Juli 2025</p>
                    <p className="signature-label">Orang Tua/Wali Calon Peserta Didik</p>
                    <div className="signature-space"></div>
                    <p className='line1'>_____________________________</p>
                    <p className="signature-name">Nama:</p>
                </div>
            </div>

            {/* Styles */}
            <style jsx>{`
                .surat-pernyataan-ortu-container {
                    width: 794px;
                    min-height: 1123px;
                    padding: 60px 80px;
                    background: white;
                    font-family: 'Times New Roman', Times, serif;
                    position: relative;
                    box-sizing: border-box;
                    font-size: 12pt;
                    line-height: 1.8;
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
                    margin: 0;
                }

                /* Data Table */
                .data-table {
                    width: 100%;
                    margin: 0;
                    border-collapse: collapse;
                }

                .data-table td {
                    padding: 3px 0;
                    vertical-align: top;
                }

                .line1 {
                    margin: 0 10px 0 0;
                }

                .number1 {
                    width: 30px;
                    text-align: left;
                    vertical-align: top;
                    padding-right: 10px;
                }

                .number {
                    width: 30px;
                    padding-left: 20px;
                }

                .label {
                    width: 200px;
                }

                .dots {
                    
                }

                /* Student Info */
                .student-intro {
                    margin: 0;
                }

                .student-table {
                    width: 100%;
                    margin: 0;
                    border-collapse: collapse;
                }

                .student-table td {
                    padding: 3px 0;
                    vertical-align: top;
                }

                .student-label {
                    width: 230px;
                }

                /* Statement */
                .statement-title {
                    margin: 0;
                }

                .statement-list {
                    margin: 0;
                    padding-left: 0;
                    text-align: justify;
                }

                .statement-list li {
                    margin: 0;
                }

                /* Closing */
                .closing {
                    text-align: justify;
                    margin: 0;
                }

                /* Signature Section */
                .signature-section {
                    display: flex;
                    justify-content: flex-end;
                    margin: 0;
                }

                .signature-right {
                    width: 50%;
                    text-align: center;
                }

                .signature-place {
                    margin: 0;
                    margin: 20px 106px 0 0;
                }

                .signature-label {
                    margin: 0 0 0 0;
                }

                .signature-space {
                    height: 80px;
                }

                .signature-name {
                    margin: -10px 0 0 30px;
                    text-align: left;
                }

                /* Print Styles */
                @media print {
                    .surat-pernyataan-ortu-container {
                        margin: 0;
                        padding: 25mm 25mm;
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

export default TemplatePernyataanOrtu