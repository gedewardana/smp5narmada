import React from 'react'

function Wrapper({ children }) {
    return (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 max-h-[85vh] overflow-y-auto">
            {children}
        </div>
    )
}

export default Wrapper