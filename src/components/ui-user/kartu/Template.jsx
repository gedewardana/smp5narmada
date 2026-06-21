import React from 'react'


function Template({ data }) {
    return (
        <div className="kartu-container">
            {/* Header dengan Logo */}
            <div className="header">
                <div className="logo-left">
                    <img src="/lkb.png" alt="Logo Lombok Barat" width="80" height="80" style={{ objectFit: 'contain' }} />
                </div>

                <div className="header-text">
                    <h1 className="header-title">PEMERINTAH KABUPATEN LOMBOK BARAT</h1>
                    <h2 className="header-subtitle">DINAS PENDIDIKAN DAN KEBUDAYAAN</h2>
                    <h1 className="header-school">SMP NEGERI 5 NARMADA</h1>
                    <p className="header-address">Jln. Suranadi II Desa Suranadi Kec. Narmada (83371)</p>
                </div>

                <div className="logo-right">
                    <img src="/tut.png" alt="Logo Tut Wuri Handayani" width="80" height="80" style={{ objectFit: 'contain' }} />
                </div>
            </div>

            {/* Garis Pemisah */}
            <div className="divider"></div>

            {/* Judul Kartu */}
            <h2 className="card-title">KARTU TANDA PENDAFTARAN</h2>

            {/* Data Pendaftaran */}
            <div className="content">
                <div className="data-section">
                    <table className="data-table">
                        <tbody>
                            <tr>
                                <td className="label">Nomor Pendaftaran</td>
                                <td className="colon">:</td>
                                <td className="value">{data?.nomor_pendaftaran || '_______________'}</td>
                            </tr>
                            <tr>
                                <td className="label">Nama Siswa</td>
                                <td className="colon">:</td>
                                <td className="value">{data?.nama_lengkap || '_______________'}</td>
                            </tr>
                            <tr>
                                <td className="label">Asal Sekolah</td>
                                <td className="colon">:</td>
                                <td className="value">{data?.asal_sekolah || '_______________'}</td>
                            </tr>
                            <tr>
                                <td className="label">Jumlah Nilai SKHU</td>
                                <td className="colon">:</td>
                                <td className="value">{data?.nilai_skhu || '_______________'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Foto dan TTD */}
                <div className="bottom-section">
                    <div className="photo-box">
                        {data?.foto ? (
                            <img src={data.foto} alt="Pas Foto" style={{ width: '113px', height: '151px', objectFit: 'cover' }} className="photo" />
                        ) : (
                            <div className="photo-placeholder">3x4</div>
                        )}
                    </div>

                    <div className="signature-section">
                        <p className="signature-place">Narmada, {data?.tanggal_verifikasi || '-'}</p>
                        <p className="signature-title">Ketua</p>
                        <div className="signature-image">
                            <img src="/ttd.png" alt="Tanda Tangan" width="150" height="60" style={{ objectFit: 'contain' }} />
                        </div>
                        <p className="signature-name">(Bayu Indriarto, S.Pd)</p>
                        <p className="signature-nip">NIP. 19900918 201502 1 001</p>
                    </div>
                </div>
            </div>



            {/* Print Styles */}
            <style jsx>{`
                .kartu-container {
                    width: 210mm; /* Force fixed width for perfect PDF rendering */
                    min-height: 297mm;
                    padding: 20mm;
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

                .logo-left, .logo-right {
                    flex-shrink: 0;
                }

                .header-text {
                    text-align: center;
                    flex: 1;
                    padding: 0 10px;
                    min-width: 0; /* Mencegah overflow pada flexbox dengan memaksa text wrap */
                    word-wrap: break-word;
                }

                .header-title {
                    font-size: 14pt;
                    font-weight: bold;
                    margin: 0;
                    padding: 4px 0;
                    line-height: 1.5;
                }

                .header-subtitle {
                    font-size: 12pt;
                    font-weight: bold;
                    margin: 0;
                    padding: 4px 0;
                    line-height: 1.5;
                }

                .header-school {
                    font-size: 14pt;
                    font-weight: bold;
                    margin: 0;
                    padding: 4px 0;
                    line-height: 1.5;
                }

                .header-address {
                    font-size: 11pt;
                    margin: 2px 0;
                    font-style: italic;
                }

                /* Divider */
                .divider {
                    border-top: 3px solid black;
                    border-bottom: 1px solid black;
                    height: 3px;
                    margin: 8px 0;
                }

                /* Card Title */
                .card-title {
                    font-size: 16pt;
                    font-weight: bold;
                    text-align: center;
                    margin: 8px 0;
                    text-decoration: underline;
                }

                /* Content */
                .content {
                    margin-top: 10px;
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11pt;
                }

                .data-table td {
                    padding: 4px 0;
                    vertical-align: top;
                }

                .label {
                    width: 150px;
                }

                .colon {
                    width: 20px;
                    text-align: center;
                }

                .value {
                    border-bottom: 1px solid black;
                    min-width: 300px;
                }

                /* Bottom Section */
                .bottom-section {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 12px;
                }

                .photo-box {
                    width: 113px;
                    height: 151px;
                    border: 2px solid black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .photo-placeholder {
                    font-size: 11pt;
                    color: #999;
                }

                .signature-section {
                    text-align: center;
                    font-size: 11pt;
                }

                .signature-place {
                    margin: 0 0 5px 0;
                }

                .signature-title {
                    margin: 0;
                    position: relative;
                    z-index: 10;
                }

                .signature-image {
                    margin: -10px auto -15px auto; /* Slightly overlap but don't cover text completely */
                    position: relative;
                    z-index: 1;
                }

                .signature-name {
                    margin: 0 0 2px 0;
                    text-decoration: underline;
                    position: relative;
                    z-index: 10;
                }

                .signature-nip {
                    margin: 0;
                }

                /* Footer Note */
                .footer-note {
                    margin-top: 10px;
                    font-size: 11pt;
                }

                .note-text {
                    margin: 0;
                    line-height: 1.3;
                }


            `}</style>
        </div>
    )
}

export default Template