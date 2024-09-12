import React from 'react'

const ProductList = ({ searchResults, toggleCheckbox, toggleVariantCheckbox, isProductSelected, isVariantSelected, innerRef }) => {
    return (
        <>
            {searchResults?.map((product) => (
                <React.Fragment key={product?.name}>
                    <div className="flex items-center px-4 py-2 gap-4 border border-y-gray-300 dark:border dark:border-y-slate-500" ref={innerRef}>
                        <div className="flex items-center cursor-pointer" onClick={() => toggleCheckbox(product?.id)} role="checkbox" aria-checked={isProductSelected(product?.id)} tabIndex={0}
                        >
                            {/* Product checkbox */}
                            <div
                                className={`w-7 h-7 border-2 rounded-md flex items-center justify-center transition-colors 
    ${isProductSelected(product.id) ? 'bg-emerald-600 border-emerald-600' : 'border-gray-400 '}`}
                            >
                                {isProductSelected(product.id) && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-24 h-24 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <img loading='lazy' src={product?.image?.src} alt="product_image" width={40} height={40} className='rounded-md' />
                        <p className='text-base font-normal text-black dark:text-white'>{product?.title}</p>
                    </div>
                    {product.variants?.map((variant) => (
                        <div className="flex items-center px-20 py-2 gap-2 w-full  border border-t-gray-300 dark:border dark:border-t-slate-500" key={variant?.id}>
                            {/* Variant checkbox */}
                            <div
                                className="flex items-center cursor-pointer"
                                role="checkbox"
                                aria-checked={isVariantSelected(product.id, variant)}
                                tabIndex={0}
                                onClick={() => toggleVariantCheckbox(product.id, variant)}
                            >
                                <div className={`w-7 h-7 border-2 rounded-md flex items-center justify-center transition-colors 
    ${isVariantSelected(product.id, variant) ? 'bg-emerald-600 border-emerald-600' : 'border-gray-400'}`}
                                >
                                    {isVariantSelected(product.id, variant) && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    )}
                                </div>

                            </div>
                            <p className='text-sm font-normal text-black dark:text-white'>{variant?.title}</p>
                            <div className="flex justify-end gap-4 ml-4">
                                <p className='text-base font-normal text-black dark:text-white'>99 available</p>
                                <p className='text-base font-normal text-black dark:text-white'>${variant?.price}</p>
                            </div>
                        </div>
                    ))}
                </React.Fragment>
            ))}
        </>
    )
}

export default ProductList