import React, { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import { BsCheckSquareFill } from "react-icons/bs";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const ProductPickerModal = ({ isOpen, closeModal, productName }) => {
    const [initialData, setInitialData] = useState({
        'from': 0,
        'to': 10
    });
    const [isChecked, setIsChecked] = useState(false);
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProducts, setSelectedProducts] = useState([])
    const [searchResults, setSearchResults] = useState([]);

    const fetchProductList = async () => {
        const products = await axios.get('https://mocki.io/v1/29576a7b-2005-4e02-bdfb-389df2037a5f')
        return products
    }


    const { isFetching, isPending, isError, data: productData, error } = useQuery({
        queryKey: ['productData'],
        queryFn: fetchProductList,
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        const handler = setTimeout(() => {
            if (productData) {
                const filtered = searchTerm
                    ? productData?.data?.filter((product) =>
                        product.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    : productData?.data;
                setSearchResults(filtered);
            }
        }, 300); // Debounce delay

        // Cleanup the timeout when the search term changes
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, productData]);
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        // Check if the user has scrolled to the bottom of the list
        if (scrollTop + clientHeight >= scrollHeight && initialData.to < productData?.data?.length) {
            setInitialData((prevState) => ({
                from: prevState.to,
                to: prevState.to + 10
            }));
        }
    };



    const toggleCheckbox = (id) => {
        setSelectedProducts((prevSelected) => {
            const isAlreadySelected = prevSelected.some((product) => product.id === id);

            if (isAlreadySelected) {
                return prevSelected.filter((product) => product.id !== id);  // If product is already selected, filter it out (uncheck)
            } else {
                const productToAdd = productData?.data.find((product) => product.id === id);   // Find the product in the data


                return productToAdd ? [...prevSelected, productToAdd] : prevSelected;    // If found, add it to the selected products (check)
            }
        });
    };


    const toggleVariantCheckbox = (productId, variant) => {
        setSelectedProducts((prev) => {
            const productIsSelected = prev.find((product) => product.id === productId) // Check if the product is already in the selectedProducts array
            if (productIsSelected) {
                return prev.map((product) => {
                    if (product.id === productId) {
                        const isVariantSelected = product.variants.includes(variant);
                        console.log("isVarientSelected", variant)

                        if (isVariantSelected) {
                            const updatedVariants = product.variants.filter((id) => id !== variant);  // Unselect the variant

                            // If no variants are left, remove the product entirely
                            if (updatedVariants.length === 0) {
                                return { ...product, variants: [] };
                            }
                            return { ...product, variants: updatedVariants };
                        } else {
                            return { ...product, variants: [...product.variants, variant] };   // Add the variant
                        }
                    }
                    return product;
                }).filter((product) => product.variants.length > 0) // remove the product from selectedProducts if they don't have any variants.
            } else {
                const product = productData?.data.find((product) => product.id === productId);  // If the product is not in selectedProducts, add it with the selected variant

                return product
                    ? [...prev, { ...product, variants: [variant] }]
                    : prev;
            }
        });
    };

    // check is product selected or not
    const isProductSelected = (productId) => {
        return selectedProducts.some((product) => product.id === productId);
    };

    // check is varient is selected or not
    const isVariantSelected = (productId, variant) => {
        const product = selectedProducts.find((product) => product.id === productId);
        return product?.variants.includes(variant);
    };

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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded px-10 py-1 cursor-pointer focus:outline-none"
                    />
                    <GoSearch size={20}
                        color='black'
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {/* prouct list  */}
                <div className="h-80 overflow-auto" onScroll={handleScroll}>
                    {searchResults?.slice(0, initialData?.to).map((product) => (
                        <>
                            <div className="flex items-center px-4 py-2 gap-4 border border-y-gray-300">
                                <div className="flex items-center cursor-pointer" onClick={() => toggleCheckbox(product?.id)} role="checkbox" aria-checked={isChecked} tabIndex={0}

                                >
                                    {/* Product checkbox */}
                                    <div
                                        className={`w-7 h-7 border-2 rounded-md flex items-center justify-center transition-colors 
                    ${isProductSelected(product.id) ? 'bg-emerald-600 border-emerald-600' : 'border-gray-400'}`}
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
                                <img src={product?.image?.src} alt="product_image" width={40} height={40} className='rounded-md' />
                                <p className='text-base font-normal text-black'>{product?.title}</p>
                            </div>
                            {product.variants?.map((variant) => (
                                <div className="flex items-center px-20 py-2 gap-2 w-full  border border-t-gray-300">
                                    {/* Variant checkbox */}
                                    <div
                                        className="flex items-center cursor-pointer"
                                        role="checkbox"
                                        ariaChecked={isVariantSelected(product.id, variant)}
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
                                    <p className='text-sm font-normal text-black'>{variant?.title}</p>
                                    <div className="flex justify-end w-1/2 gap-3">
                                        <p className='text-base font-normal text-black'>99 available</p>
                                        <p className='text-base font-normal text-black'>${variant?.price}</p>
                                    </div>
                                </div>
                            ))}

                        </>
                    ))}
                </div>


                <div className="border-t border-gray-300">
                    <div className="flex items-center justify-between px-6 py-2 ">
                        <h2 className="text-base">{selectedProducts?.length} product selected</h2>
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