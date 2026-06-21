import React from 'react'
import ButtonReusable from '@/components/ui-user/pengumuman/ButtonReusable'

function ButtonSubmitted({ handleSubmit }) {
    return (
        <div>
            {/* button submitted */}
            <ButtonReusable
                onClick={handleSubmit}
                variant="primary"
                size="sm"
                icon="📥"
            >
                Submit Daftar Ulang
            </ButtonReusable>
        </div>
    )
}

export default ButtonSubmitted