import React from 'react'
import { IoMdClose } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import { BsCheckSquareFill } from "react-icons/bs";

const ProductPickerModal = ({ isOpen, closeModal, productName }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black opacity-50 absolute inset-0" onClick={closeModal}></div>
            <div className="w-1/3 flex flex-col gap-2 bg-white z-10 rounded-md">
                {/* modal header start */}
                <div className="flex items-center justify-between px-6 py-2 border-b border-gray-300">
                    <h2 className="text-lg font-semibold text-black">Select Products</h2>
                    <IoMdClose size={25} onClick={closeModal} className='cursor-pointer' />
                </div>
                {/* modal header end */}
                {/* product search bar */}
                <div className="relative mx-4">
                    <input
                        type="text"
                        placeholder="Search product"
                        className="w-full border border-gray-300 rounded px-10 py-1 cursor-pointer focus:outline-none"
                    />
                    <GoSearch size={20}
                        color='black'
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {/* prouct list  */}
                <div className="flex items-center px-4 py-2 gap-4 border border-y-gray-300">
                    <BsCheckSquareFill size={30} color='#008060' />
                    <img src="https://via.placeholder.com/150/24f355" alt="product_image" width={50} height={50} className='rounded-md' />
                    <p className='text-base font-normal text-black'>Long Socks - Made with natural materials</p>
                </div>
                <div className="flex items-center px-20 py-2 gap-4 w-full">
                    <BsCheckSquareFill size={30} color='#008060' className='cursor-pointer' />
                    <p>S/ White / Cotton</p>
                    <div className="flex justify-end w-1/2 gap-8">
                        <p className='text-base font-normal text-black'>99 available</p>
                        <p className='text-base font-normal text-black'>$3.99</p>
                    </div>
                </div>
                <div className="border-t border-gray-300">
                    <div className="flex items-center justify-between px-6 py-2 ">
                        <h2 className="text-base">1 product selected</h2>
                        <div className="flex gap-3">
                            <button className="px-8 py-1 border-2 border-gray-400 text-gray-600 text-base font-semibold rounded" onClick={closeModal}>Cancel</button>
                            <button className=" px-8 py-1 bg-emerald-600 text-white rounded">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductPickerModal