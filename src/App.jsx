import React, { useState } from "react";
import Header from "./components/Header"
import { MdDragIndicator, MdOutlineClose } from "react-icons/md";
import { HiPencil } from "react-icons/hi2";
import ProductPickerModal from "./components/ProductPickerModal";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";




function App() {
  const [product, setProduct] = useState([
    { id: '1', productName: '', discount: '' }
  ]);

  const [draggingItemIndex, setDraggingItemIndex] = useState(null);
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
  const [visibleDiscount, setVisibleDiscount] = useState(null)
  const [showVariants, setShowVariants] = useState(false);

  // Function to handle drag start
  const handleDragStart = (index) => {
    setDraggingItemIndex(index);
  };

  // Function to handle drag over (allows dropping)
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default to allow dropping
  };

  const handleSelectedProducts = (products) => {
    setSelectedProducts(products);
  };

  // Function to handle drop event
  const handleDrop = (index) => {
    const draggedProduct = product[draggingItemIndex];
    const remainingProducts = selectedProduct?.filter((_, idx) => idx !== draggingItemIndex);

    // Insert dragged item at the new position
    const updatedProducts = [
      ...remainingProducts.slice(0, index),
      draggedProduct,
      ...remainingProducts.slice(index)
    ];

    setProduct(updatedProducts);
    setDraggingItemIndex(null); // Reset drag state
  };

  // Handle adding new product row
  const addProduct = () => {
    setSelectedProducts([
      ...selectedProduct,
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
      }
    ]);
  };


  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDiscountToggle = (index) => {
    setVisibleDiscount(visibleDiscount === index ? null : index);
  };

  return (
    <>
      <Header />
      <div className="mt-6 mx-auto w-1/2 px-10">
        <h2 className="mb-4 text-xl font-semibold">Add Products</h2>

        {/* Header Section for Product and Discount Labels */}
        <div className="grid grid-cols-2 gap-4">
          <p className="ml-2">Product</p>
          <p className="ml-2">Discount</p>
          {selectedProduct?.map((product, index) => (
            <React.Fragment key={product?.id}>
              <div
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)} className="ml-2 cursor-pointer">
                <div className="flex items-center">
                  <MdDragIndicator size={35} color="gray" />
                  <span className="mr-2">{index + 1}. </span>

                  {/* Input Section */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={product?.title?.length > 30 ? `${product?.title.slice(0, 30)}...` : product?.title}
                      placeholder="Select Product"
                      className="w-full border border-gray-300 rounded p-2 cursor-pointer truncate"
                      onClick={() => openModal(product)} // Open modal on input click
                    />
                    <HiPencil size={20}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
              {/* Discount Button Section (Placed Below Discount Text) */}
              <div className="ml-2">
                {visibleDiscount == index ? <div className="flex flex-1 gap-3 items-center">
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
                  <MdOutlineClose size={25} color="gray" />
                </div> :
                  <button className="flex items-center p-2 bg-green-600 text-white rounded w-40" onClick={() => handleDiscountToggle(index)}>
                    Add Discount
                  </button>}
              </div>
              {product?.id != null && <div className="col-span-2">
                <div
                  onClick={() => setShowVariants(!showVariants)}
                  className="flex gap-2 mb-2 items-center float-right mr-24 cursor-pointer"
                >
                  {showVariants ?
                    <>
                      <p className="text-blue-600 text-sm font-medium">Hide Variants</p>
                      <FaChevronUp color="blue" />
                    </>
                    :
                    <>
                      <p className="text-blue-600 text-sm font-medium">Show Variants</p>
                      <FaChevronDown color="blue" />
                    </>
                  }
                </div>
              </div>
              }
              {showVariants && <div className="col-span-2">
                {product?.variants?.map((variant, variantIndex) => (
                  <div key={variant.id} className="flex gap-2 mb-2 items-center float-right mr-12">
                    <MdDragIndicator size={35} color="gray" />
                    <input
                      type="text"
                      value={variant.title}
                      placeholder="Variant Title"
                      className="w-1/3 border border-gray-300 rounded p-2"
                      readOnly
                    />
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
                    <MdOutlineClose size={25} color="gray" />
                  </div>
                ))}
              </div>}

            </React.Fragment>
          ))}
        </div>
        <div className="ml-4">
          <button
            onClick={addProduct}
            className="px-16 py-3 mt-4 ml-80 border-2 border-emerald-600 text-emerald-600 rounded hover:bg-emerald-700 hover:outline-none hover:text-white hover:font-semibold hover:border-none"
          >
            Add Product
          </button>
        </div>
      </div>

      <ProductPickerModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        productName={selectedProduct?.productName}
        onSelectProducts={handleSelectedProducts}
      />
    </>
  )
}

export default App
