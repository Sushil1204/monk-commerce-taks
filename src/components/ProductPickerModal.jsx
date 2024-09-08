import React, { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import { BsCheckSquareFill } from "react-icons/bs";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SearchBar from './SearchBar';
import ProductList from './ProductList';

const ProductPickerModal = ({ isOpen, closeModal, productName, onSelectProducts }) => {
    const [initialData, setInitialData] = useState({
        'from': 0,
        'to': 10
    });
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

    // Add the products
    const handleAddProducts = () => {
        // Call the function passed from the parent with the selectedProducts array
        onSelectProducts(selectedProducts);
        closeModal();  // Optionally close the modal after adding
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
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {/* prouct list  */}
                <ProductList
                    searchResults={searchResults}
                    initialData={initialData}
                    handleScroll={handleScroll}
                    toggleCheckbox={toggleCheckbox}
                    toggleVariantCheckbox={toggleVariantCheckbox}
                    isProductSelected={isProductSelected}
                    isVariantSelected={isVariantSelected}
                />
                <div className="border-t border-gray-300">
                    <div className="flex items-center justify-between px-6 py-2 ">
                        <h2 className="text-base">{selectedProducts?.length} product selected</h2>
                        <div className="flex gap-3">
                            <button className="px-8 py-1 border-2 border-gray-400 text-gray-600 text-base font-semibold rounded" onClick={closeModal}>Cancel</button>
                            <button className=" px-8 py-1 bg-emerald-600 text-white rounded" onClick={handleAddProducts}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductPickerModal