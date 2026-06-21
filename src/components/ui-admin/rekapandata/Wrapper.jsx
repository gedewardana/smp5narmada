import React from 'react'

function Wrapper({ children }) {
    return (
        <div className='bg-white border border-gray-200 mt-6 overflow-hidden rounded-xl'>
            {children}
        </div>
    )
}

export default Wrapper