import React from 'react'
import monk_logo from '../assets/monk_logo.png'

const Header = () => {
    return (
        <div className='h-14 px-4 border-2 border-b-neutral-600 flex items-center gap-2'>
            <img src={monk_logo} alt="monk_logo" srcset="" />
            <p className='text-base font-semibold text-neutral-600'>Monk Upsell & Cross-sell</p>
        </div>
    )
}

export default Header