import React from 'react'

function Wrapper({ children }) {
    return (
        <div className="bg-gray-50 p-8 rounded-lg ml-20 mr-20 mt-20 mb-20 border border-gray-200 ">
            {children}
        </div>
    )
}

export default Wrapper