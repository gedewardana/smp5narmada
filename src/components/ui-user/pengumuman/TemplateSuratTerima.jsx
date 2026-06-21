import React from 'react'
import { formatSingleDate } from '@/utils/dateUtils'

/**
 * TemplateSuratTerima - Surat Penerimaan/Penolakan
 * Size: A4 (210mm x 297mm)
 * Font: Times New Roman
 */
function TemplateSuratTerima({ data }) {
    // Determine if accepted or rejected
    const isDiterima = data?.pengumuman_hasil_seleksi === 'DITERIMA'

    return (
        <div className="surat-terima-container">
            {/* Header dengan Logo */}
            <div className="header">
                <div className="logo-left">
                    <img src="/barat.png" alt="Logo Lombok Barat" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                </div>

                <div className="header-text">
                    <h1 className="header-title">PEMERINTAH KABUPATEN LOMBOK BARAT</h1>
                    <h2 className="header-subtitle">DINAS PENDIDIKAN DAN KEBUDAYAAN</h2>
                    <h1 className="header-school">SMP NEGERI 5 NARMADA</h1>
                    <p className="header-address">Jln. Suranadi II Desa Suranadi Kecamatan Narmada Kode Pos : 83371</p>
                </div>

                <div className="logo-right">
                    <img src="/wuri.png" alt="Logo Tut Wuri Handayani" style={{ width: '95px', height: '95px', objectFit: 'contain' }} />
                </div>
            </div>

            {/* Garis Pemisah */}
            <div className="divider"></div>

            {/* Content */}
            <div className="content">
                {/* Pembukaan */}
                <p className="opening">
                    Berdasarkan keputusan Kepala Sekolah dan Panitia SPMB Tahun {data?.tahun_ajaran || '-'} dengan ini
                </p>

                <p className="statement">
                    <strong>Menyatakan bahwa</strong> siswa/siswi:
                </p>

                {/* Data Siswa */}
                <table className="data-table">
                    <tbody>
                        <tr>
                            <td className="label">Nama</td>
                            <td className="colon">:</td>
                            <td className="value">{data?.nama_lengkap || '...................................................'}</td>
                        </tr>
                        <tr>
                            <td className="label">No Pendaftaran</td>
                            <td className="colon">:</td>
                            <td className="value">{data?.nomor_pendaftaran || '...................................................'}</td>
                        </tr>
                        <tr>
                            <td className="label">Asal sekolah</td>
                            <td className="colon">:</td>
                            <td className="value">{data?.nama_sekolah || '...................................................'}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Hasil Seleksi */}
                <p className="result">
                    dinyatakan{' '}
                    <span className={isDiterima ? 'diterima' : 'tidak-diterima-crossed'}>
                        DITERIMA
                        {!isDiterima && <span className="coret-line"></span>}
                    </span>
                    {' / '}
                    <span className={!isDiterima ? 'tidak-diterima' : 'diterima-crossed'}>
                        TIDAK DITERIMA
                        {isDiterima && <span className="coret-line"></span>}
                    </span>
                    {' '}menjadi siswa/siswi SMPN 5 Narmada Tahun pelajaran {data?.tahun_ajaran || '-'}.
                </p>

                {/* TTD Section */}
                <div className="signature-section">
                    <div className="signature-left">
                        <p className="signature-label">Mengetahui,</p>
                        <p className="signature-title">Kepala Sekolah</p>
                        <div className="signature-image">
                            <img src="/ttd.png" alt="TTD Kepala Sekolah" style={{ width: '150px', height: '60px', objectFit: 'contain' }} />
                        </div>
                        <p className="signature-name"><u>KADAR KENCANA, S.Pd</u></p>
                        <p className="signature-nip">NIP. 19750803 200701 1 015</p>
                    </div>

                    <div className="signature-right">
                        <p className="signature-place">Narmada, {data?.tanggal_pengumuman ? formatSingleDate(data.tanggal_pengumuman) : '-'}</p>
                        <p className="signature-title">Ketua Panitia</p>
                        <div className="signature-image">
                            <img src="/ttd.png" alt="TTD Ketua Panitia" style={{ width: '150px', height: '60px', objectFit: 'contain' }} />
                        </div>
                        <p className="signature-name"><u>BAYU INDRIARTO, S.Pd</u></p>
                        <p className="signature-nip">NIP. 19900918 201502 1 001</p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                .surat-terima-container {
                    width: 794px;
                    min-height: 1123px;
                    padding: 60px 80px;
                    background: white;
                    font-family: 'Times New Roman', Times, serif;
                    position: relative;
                    box-sizing: border-box;
                    margin: 0 auto;
                }

                /* Header */
                .header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }

                .logo-left {
                    flex-shrink: 0;
                    width: 100px;
                }

                .logo-right {
                    flex-shrink: 0;
                    width: 100px;
                }   

                .header-text {
                    text-align: center;
                    flex: 1;
                    padding: 0 10px;
                }

                .header-title {
                    font-size: 13pt;
                    font-weight: bold;
                    margin: 0;
                    line-height: 1.3;
                }

                .header-subtitle {
                    font-size: 13pt;
                    font-weight: bold;
                    margin: 2px 0;
                    line-height: 1.3;
                }

                .header-school {
                    font-size: 14pt;
                    font-weight: bold;
                    margin: 2px 0;
                    line-height: 1.3;
                }

                .header-address {
                    font-size: 10pt;
                    margin: 2px 0;
                    font-style: italic;
                }

                /* Divider */
                .divider {
                    border-top: 3px solid black;
                    border-bottom: 1px solid black;
                    height: 3px;
                    margin: 8px 0 30px 0;
                }

                /* Content */
                .content {
                    font-size: 12pt;
                    line-height: 1.8;
                }

                .opening {
                    text-align: justify;
                    margin-bottom: 15px;
                }

                .statement {
                    margin-bottom: 20px;
                }

                /* Data Table */
                .data-table {
                    width: 100%;
                    margin: 20px 0 30px 0;
                    border-collapse: collapse;
                }

                .data-table td {
                    padding: 5px 0;
                    vertical-align: top;
                }

                .label {
                    width: 150px;
                }

                .colon {
                    width: 20px;
                }

                .value {
                    border-bottom: 1px dotted black;
                    min-width: 300px;
                }

                /* Result */
                .result {
                    text-align: justify;
                    margin: 30px 0;
                }

                .diterima, .tidak-diterima, .diterima-crossed, .tidak-diterima-crossed {
                    font-size: 16pt;
                    font-weight: bold;
                    position: relative;
                    display: inline-block;
                }

                .coret-line {
                    position: absolute;
                    left: 0;
                    top: 0.9em;
                    width: 100%;
                    border-top: 2px solid black;
                }

                /* Signature Section */
                .signature-section {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 60px;
                }

                .signature-left, .signature-right {
                    width: 45%;
                    text-align: center;
                }

                .signature-label {
                    margin: 0 0 5px 0;
                }

                .signature-place {
                    margin: 0 0 5px 0;
                }

                .signature-title {
                    margin: 0 0 10px 0;
                }

                .signature-image {
                    margin: 0 0 -4px 0;
                   margin-left: 20mm;
                }

                .signature-name {
                    margin: 5px 0 2px 0;
                    font-weight: bold;
                }

                .signature-nip {
                    margin-top: -3mm;
                    margin-right: -1mm;

                }

                /* Print Styles */
                @media print {
                    .surat-terima-container {
                        margin: 0;
                        padding: 20mm;
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

export default TemplateSuratTerima
