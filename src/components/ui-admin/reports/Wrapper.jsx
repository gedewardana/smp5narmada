import React from 'react'

function Wrapper({ children }) {
    return (
        <div className='bg-white overflow-auto max-h-[85vh]'>
            {children}
        </div>
    )
}

export default Wrapper