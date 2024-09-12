import React, { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import SearchBar from './SearchBar';
import ProductList from './ProductList';
import useDebounceHook from '../hooks/useDebounceHook';
import { useInView } from 'react-intersection-observer';

const ProductPickerModal = ({ isOpen, closeModal, onSelectProducts, selectedIndex }) => {
    const { ref, inView } = useInView() // State to track the last element
    const [searchTerm, setSearchTerm] = useState('') // State to  store search term
    const [selectedProducts, setSelectedProducts] = useState([]) // State to store selected products
    const [isSearching, setIsSearching] = useState(false); // State to track search loading

    const debouncedSearchTerm = useDebounceHook(searchTerm, 2000) // custom hook for debouncing

    // query funtion
    const fetchProductList = async ({ pageParam = 1 }) => {
        const response = await axios.get('https://stageapi.monkcommerce.app/task/products/search', {
            params: {
                search: searchTerm,
                page: pageParam,
                limit: 10,
            },
            headers: {
                'x-api-key': import.meta.env.VITE_API_KEY,
                Accept: '*/*'
            },
        });
        return response;
    }

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, isFetching } = useInfiniteQuery({
        queryKey: ['productData', debouncedSearchTerm],
        queryFn: ({ pageParam = 1 }) => fetchProductList({ pageParam }),  // reseting the pageParam to 1 when we search
        refetchOnWindowFocus: false,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.length <= 10 && allPages.length + 1; // stopping the pageParam increment
        },
        onSettled: () => {
            setIsSearching(false); // Reset search loading state after data is settled
        },
        onFetch: () => {
            console.log(status)
            setIsSearching(true); // Set search loading state when fetching
        },

    })

    const toggleCheckbox = (id) => {
        setSelectedProducts((prevSelected) => {
            const isAlreadySelected = prevSelected.some((product) => product.id === id);
            if (isAlreadySelected) {
                return prevSelected.filter((product) => product.id !== id);  // If product is already selected, filter it out (uncheck)
            } else {
                const allProducts = data?.pages.flatMap((page) => page.data) || [];

                const productToAdd = allProducts?.find((product) => product.id === id);   // Find the product in the data
                return productToAdd ? [...prevSelected, productToAdd] : prevSelected;    // If found, add it to the selected products (check)
            }
        });
    };

    useEffect(() => {
        // checking the ref element is in view or not
        if (inView && hasNextPage) {
            fetchNextPage() // if yes then fetch next products
        }
    }, [inView, hasNextPage, fetchNextPage])

    const toggleVariantCheckbox = (productId, variant) => {
        setSelectedProducts((prev) => {
            // Flatten the paginated data to search for the product
            const allProducts = data?.pages.flatMap((page) => page.data) || [];
            const productIsSelected = prev.find((product) => product.id === productId) // Check if the product is already in the selectedProducts array
            if (productIsSelected) {
                return prev.map((product) => {
                    if (product.id === productId) {
                        const isVariantSelected = product.variants.includes(variant);
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
                // Find the product from the paginated data
                const product = allProducts.find((product) => product.id === productId);
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
        onSelectProducts(selectedProducts, selectedIndex);
        closeModal();  // Optionally close the modal after adding
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black opacity-50 absolute inset-0" onClick={closeModal}></div>
            <div className="w-1/3 min-w-fit flex flex-col gap-2 bg-white z-10 rounded-md dark:bg-slate-800">
                {/* modal header start */}
                <div className="flex items-center justify-between px-6 py-2 border-b border-gray-300">
                    <h2 className="text-lg font-semibold text-black dark:text-white">Select Products</h2>
                    <IoMdClose size={25} onClick={closeModal} className='cursor-pointer' />
                </div>
                {/* modal header end */}
                {/* product search bar */}
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {/* prouct list  */}
                <div className='h-80 overflow-y-scroll scroll-smooth custom-scrollbar'>
                    {isFetching && (
                        <div className='loader'>
                        </div>
                    )}
                    {status === 'error' && <p>Error fetching data...</p>}
                    {data?.pages?.map((group, i) => {
                        return (
                            <React.Fragment key={i}>
                                <ProductList
                                    searchResults={group?.data}
                                    toggleCheckbox={toggleCheckbox}
                                    toggleVariantCheckbox={toggleVariantCheckbox}
                                    isProductSelected={isProductSelected}
                                    isVariantSelected={isVariantSelected}
                                    innerRef={ref}
                                />
                            </React.Fragment>

                        )
                    }
                    )}
                    {isFetchingNextPage && <div className='loader'></div>}
                </div>

                <div className="border-t border-gray-300">
                    <div className="flex items-center justify-between px-6 py-2 ">
                        <h2 className="text-base dark:text-white">{selectedProducts?.length} {selectedProducts?.length > 1 ? 'products selected' : 'product selected'}</h2>
                        <div className="flex gap-3">
                            <button className="px-8 py-1 border-2 border-gray-400 text-gray-600 text-base font-semibold rounded dark:text-white" onClick={closeModal}>Cancel</button>
                            <button className=" px-8 py-1 bg-emerald-600 text-white rounded" onClick={handleAddProducts}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ProductPickerModal