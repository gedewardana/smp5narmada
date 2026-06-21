'use client'

import Template from './Template'

/**
 * KartuPreview - Preview kartu pendaftaran sebelum print/download
 */
function KartuPreview({ data }) {
    return (
        <div className="w-full overflow-x-auto pb-4">
            {/* <h2 className="text-2xl font-bold text-gray-800 mb-4">Preview Kartu Pendaftaran</h2> */}
            <div className='flex justify-center min-w-[210mm]'>
                <div className="bg-white shadow-lg" style={{ width: '210mm' }}>
                    <Template data={data} />
                </div>
            </div>
        </div>
    )
}

export default KartuPreview