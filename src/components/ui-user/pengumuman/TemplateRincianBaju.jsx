import React from 'react'

function TemplateRincianBaju() {
    const items = [
        { no: 1, nama: 'BAJU OLAHRAGA', harga: 160000 },
        { no: 2, nama: 'BAJU HAS', harga: 190000 },
        { no: 3, nama: 'BAJU IMTAK', harga: 190000 },
        { no: 4, nama: 'IKAT PINGGANG', harga: 20000 },
        { no: 5, nama: 'DASI', harga: 20000 },
        { no: 6, nama: 'TOPI', harga: 25000 },
        {
            no: 7,
            nama: `ATRIBUT 3 SET:
PRAMUKA
HAS
PUTIH BIRU`,
            harga: 45000
        },
        { no: 8, nama: 'PAPAN NAMA', harga: 15000 },
        { no: 9, nama: 'SAMPUL RAPOT POLIO', harga: 30000 },
    ]

    const total = items.reduce((acc, item) => acc + item.harga, 0)

    const formatRupiah = (value) =>
        new Intl.NumberFormat('id-ID').format(value)

    return (
        <div className="container">
            <h1 className="title">
                DAFTAR HARGA BAJU SERAGAM SMPN 5 NARMADA
            </h1>

            <table className="table">
                <thead>
                    <tr>
                        <th style={{ width: '60px' }}>NO</th>
                        <th>NAMA SERAGAM</th>
                        <th style={{ width: '180px' }}>HARGA</th>
                        <th style={{ width: '120px' }}>KET.</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.no}>
                            <td className="center">{item.no}</td>
                            <td className="multiline">
                                {item.nama}
                            </td>
                            <td>
                                Rp. {formatRupiah(item.harga)}
                            </td>
                            <td></td>
                        </tr>
                    ))}

                    <tr>
                        <td colSpan="2" className="total-label">
                            TOTAL
                        </td>
                        <td className="total-value">
                            Rp. {formatRupiah(total)}
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <style jsx>{`
                .container {
                    width: 794px;
                    min-height: 1123px;
                    padding: 60px 80px;
                    background: white;
                    font-family: 'Times New Roman', Times, serif;
                    position: relative;
                    box-sizing: border-box;
                    margin: 0 auto;
                }

                .title {
                    text-align: center;
                    font-size: 14pt;
                    font-weight: bold;
                    text-decoration: underline;
                    margin-bottom: 30px;
                }

                .table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12pt;
                }

                .table th,
                .table td {
                    border: 1px solid black;
                    padding: 8px;
                    vertical-align: top;
                }

                .table th {
                    text-align: center;
                    font-weight: bold;
                }

                .center {
                    text-align: center;
                }

                .multiline {
                    white-space: pre-line;
                }

                .total-label {
                    text-align: center;
                    font-weight: bold;
                    padding: 20px 0;
                }

                .total-value {
                    font-weight: bold;
                }

                @media print {
                    .container {
                        margin: 0;
                        padding: 20mm;
                        box-shadow: none;    
                    }
                }
            `}</style>
        </div>
    )
}

export default TemplateRincianBaju