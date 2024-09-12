import React from 'react'
import monk_logo from '../assets/monk_logo.png'
import { useTheme } from '../theme/ThemeProvider';
import { MdLightMode, MdDarkMode } from "react-icons/md";

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className='h-14 px-4 border-b-2 border-neutral-600 flex items-center justify-between gap-2'>
            <div className="flex items-center justify-center gap-3">
                <img src={monk_logo} alt="monk_logo" srcSet="" />
                <p className='text-sm md:text-base font-semibold text-neutral-600 dark:text-white'>Monk Upsell & Cross-sell</p>
            </div>
            <div
                onClick={toggleTheme}
                className="bg-gray-30  rounded cursor-pointer"
            >
                {theme === 'dark' ?
                    <MdLightMode size={25} className='text-white' />
                    : <MdDarkMode size={25} className='text-black' />}
            </div>
        </div>
    )
}

export default Header