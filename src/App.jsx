import React, { useState } from "react";
import Header from "./components/Header"
import { MdDragIndicator, MdOutlineClose } from "react-icons/md";
import { HiPencil } from "react-icons/hi2";
import ProductPickerModal from "./components/ProductPickerModal";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTheme } from "./theme/ThemeProvider";




function App() {

  const [product, setProduct] = useState([
    { id: '1', productName: '', discount: '' }
  ]);

  const [draggingItemIndex, setDraggingItemIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null); // New state to track the target index
  const [selectedProduct, setSelectedProducts] = useState([
    {
      id: null, // or undefined
      title: '',
      variants: [
        {
          id: null,
          product_id: null,
          title: '',
          price: ''
        }
      ],
      image: {
        id: null,
        product_id: null,
        src: ''
      }
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleDiscount, setVisibleDiscount] = useState({})
  const [visibleVariantDiscount, setVisibleVariantDiscount] = useState({})
  const [editIndex, setEditIndex] = useState(); // State to track which product is being edited
  const [draggingVariantIndex, setDraggingVariantIndex] = useState(null);
  const [dragOverVariantIndex, setDragOverVariantIndex] = useState(null); // Track the target index within variants


  const [showVariants, setShowVariants] = useState(false);

  // Function to handle drag start
  const handleDragStart = (index) => {
    setDraggingItemIndex(index);
  };

  // Function to handle drag over (allows dropping)
  const handleDragOver = (index, e) => {
    e.preventDefault(); // Prevent default to allow dropping
    setDragOverIndex(index); // Set the index of the target div
  };


  const handleSelectedProducts = (products) => {
    setSelectedProducts((prev) => {
      const updatedProducts = [...prev];
      const isSingleEdit = prev.length == 1

      isSingleEdit && updatedProducts.splice(editIndex, 1);

      const newProducts = isSingleEdit ? updatedProducts.filter(product => !products.some(p => p.id === product.id)) : products.filter(product => !prev.some(p => p.id === product.id))

      const newProductList = [...newProducts];

      isSingleEdit ?
        products.forEach((product, index) => {
          newProductList.splice(editIndex + index, 0, product)
        })
        :
        prev.splice(editIndex, 1, ...newProducts)

      return isSingleEdit ? newProductList : prev
    })
  }

  // Function to handle drop event
  const handleDrop = (index) => {
    if (draggingItemIndex === null) return;

    const draggedProduct = selectedProduct[draggingItemIndex];
    const updatedProducts = [...selectedProduct];

    // Remove the dragged item from its original position
    updatedProducts.splice(draggingItemIndex, 1)
    // Insert the dragged item at the new position
    updatedProducts.splice(index, 0, draggedProduct);

    setSelectedProducts(updatedProducts);
    setDraggingItemIndex(null); // Reset drag state
    setDragOverIndex(null); // Reset drag over index

  };

  // Handle adding new product row
  const addProduct = () => {
    setSelectedProducts((prev) => [
      ...prev,
      {
        id: null,
        title: '',
        variants: [
          {
            id: null,
            product_id: null,
            title: '',
            price: ''
          }
        ],
        image: {
          id: null,
          product_id: null,
          src: ''
        }
      }]
    );
  };

  // Function to open the modal
  const openModal = (index) => {
    setIsModalOpen(true);
    setEditIndex(selectedProduct.length == 1 ? 0 : index); // Set the index of the product to be edited
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDiscountToggle = (index) => {
    setVisibleDiscount((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleVariantsDiscountToggle = (productIndex, variantIndex) => {
    setVisibleVariantDiscount((prev) => ({
      ...prev,
      [`${productIndex}-${variantIndex}`]: !prev[`${productIndex}-${variantIndex}`]
    }));
  };

  const handleVariantDragStart = (productIndex, variantIndex) => {
    setDraggingVariantIndex({ productIndex, variantIndex });
  };

  const handleVariantDragOver = (productIndex, variantIndex, e) => {
    e.preventDefault(); // Prevent default to allow dropping
    setDragOverVariantIndex({ productIndex, variantIndex });
  };

  const handleVariantDrop = (productIndex, variantIndex) => {
    if (!draggingVariantIndex) return;

    const { productIndex: startProductIndex, variantIndex: startVariantIndex } = draggingVariantIndex;
    const updatedProducts = [...selectedProduct];
    const draggedVariant = updatedProducts[startProductIndex].variants[startVariantIndex];

    // Remove the dragged variant from its original position
    updatedProducts[startProductIndex].variants.splice(startVariantIndex, 1);
    // Insert the dragged variant at the new position
    updatedProducts[productIndex].variants.splice(variantIndex, 0, draggedVariant);

    setSelectedProducts(updatedProducts);
    setDraggingVariantIndex(null); // Reset drag state
    setDragOverVariantIndex(null); // Reset drag over index
  };

  const handleShowVariantsToggle = (index) => {
    setShowVariants((prevState) => ({
      ...prevState,
      [index]: !prevState[index] // Toggle the visibility for the specific product
    }));
  };





  return (
    <div className="dark:bg-slate-800 h-screen">
      <Header />
      <div className="flex flex-col w-full md:w-fit lg:w-1/2 mx-auto p-4 my-4 gap-3">
        <h1 className="text-sm md:text-base font-semibold dark:text-white">Add Product</h1>
        <div className="grid grid-cols-3 gap-2">
          <p className="col-span-2 md:mx-5 mb-5 dark:text-white">Product</p>
          <p className=" md:mx-5 mb-5 dark:text-white">
            Discount
          </p>
          {selectedProduct?.map((product, index) => (
            <React.Fragment key={product?.id}>
              <div draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(index, e)}
                onDrop={() => handleDrop(index)}
                className={`col-span-3 ${dragOverIndex === index ? 'bg-gray-400 p-2 rounded-md' : ''}`}
              >
                <div className="col-span-2 flex items-center justify-evenly md:gap-4">
                  <div className="flex items-center">
                    <MdDragIndicator size={35} color="gray" />
                    <span className="mr-2 dark:text-white">{index + 1}. </span>
                    <div className="relative">
                      <input
                        type="text"
                        value={product?.title?.length > 30 ? `${product?.title.slice(0, 30)}...` : product?.title}
                        placeholder="Select Product"
                        className="w-60 border border-gray-300 rounded p-2 pr-10 cursor-pointer truncate"
                      />
                      <HiPencil
                        size={20}
                        className="absolute right-3 z-1 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => openModal(index)} // Open modal on input click
                      />
                    </div>
                  </div>
                  {visibleDiscount[index] ?
                    <div className="flex items-center gap-3">

                      <input type="number" name="discount" className="w-24 border border-gray-300 rounded py-2 px-4 cursor-pointer input-number" />
                      <div className="relative inline-block">
                        <select name="discountType" className="block appearance-none w-24 border border-gray-300 rounded p-2 cursor-pointer">
                          <option value="percent"> % Off </option>
                          <option value="flat"> Flat off </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-16 flex items-center px-2 text-gray-700">
                          <FaChevronDown color="gray" />
                        </div>
                      </div>
                    </div>
                    :
                    <button className="p-2 bg-green-600 text-white rounded" onClick={() => handleDiscountToggle(index)}>
                      Add Discount
                    </button>
                  }

                </div>
              </div>
              <div className="col-span-3">
                <div className="flex items-center justify-end mr-28 text-blue-600 text-sm font-medium my-2 cursor-pointer" onClick={() => handleShowVariantsToggle(index)}
                >
                  {showVariants[index] ?
                    <div className="flex items-center gap-2">
                      <FaChevronUp color="blue" />
                      <p className="text-blue-600 text-sm font-medium">Hide Variants</p>
                    </div>
                    :
                    <div className="flex items-center gap-2">
                      <FaChevronDown color="blue" />
                      <p className="text-blue-600 text-sm font-medium">Show Variants</p>
                    </div>
                  }
                </div>

                {showVariants[index] && product?.variants?.map((variant, variantIndex) => (
                  <div
                    key={variant?.id}
                    draggable
                    onDragStart={(e) => handleVariantDragStart(index, variantIndex)}
                    onDragOver={(e) => handleVariantDragOver(index, variantIndex, e)}
                    onDrop={() => handleVariantDrop(index, variantIndex)}
                    className={`col-span-2 flex  justify-end  md:gap-4 mr-28 mb-2 ${dragOverVariantIndex?.productIndex === index && dragOverVariantIndex?.variantIndex === variantIndex ? 'bg-gray-400 p-2 rounded-md' : ''} `}>
                    <div className="flex items-center ">
                      <MdDragIndicator size={35} color="gray" />
                      <span className="mr-2 dark:text-white">{variantIndex + 1}. </span>
                      <input
                        type="text"
                        value={variant.title}
                        placeholder="Select Product"
                        readOnly
                        className="w-40 border border-gray-300 rounded p-2 pr-10 cursor-pointer truncate"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      {visibleVariantDiscount[`${index}-${variantIndex}`] ?
                        <>
                          <input type="number" name="discount" className="w-24 border border-gray-300 rounded py-2 px-4 cursor-pointer input-number" />
                          <div className="relative inline-block">
                            <select name="discountType" className="block appearance-none w-24 border border-gray-300 rounded p-2 cursor-pointer">
                              <option value="percent"> % Off </option>
                              <option value="flat"> Flat off </option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-16 flex items-center px-2 text-gray-700">
                              <FaChevronDown color="gray" />
                            </div>
                          </div>
                        </>
                        :
                        <button className="p-2 bg-green-600 text-white rounded" onClick={() => handleVariantsDiscountToggle(index, variantIndex)}>
                          Add Discount
                        </button>
                      }



                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <ProductPickerModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        productName={selectedProduct?.productName}
        onSelectProducts={handleSelectedProducts}
        selectedIndex={draggingItemIndex} // Pass the index of the product being edited
      />
    </div >
  )
}

export default App



