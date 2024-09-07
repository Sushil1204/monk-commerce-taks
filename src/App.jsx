import { useState } from "react";
import Header from "./components/Header"
import { MdDragIndicator } from "react-icons/md";
import { HiPencil } from "react-icons/hi2";
import ProductPickerModal from "./components/ProductPickerModal";



function App() {
  const [products, setProducts] = useState([
    { id: '1', productName: '1', discount: '' },
    { id: '2', productName: '2', discount: '' }
  ]);

  const [draggingItemIndex, setDraggingItemIndex] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle drag start
  const handleDragStart = (index) => {
    setDraggingItemIndex(index);
  };

  // Function to handle drag over (allows dropping)
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default to allow dropping
  };

  // Function to handle drop event
  const handleDrop = (index) => {
    const draggedProduct = products[draggingItemIndex];
    const remainingProducts = products.filter((_, idx) => idx !== draggingItemIndex);

    // Insert dragged item at the new position
    const updatedProducts = [
      ...remainingProducts.slice(0, index),
      draggedProduct,
      ...remainingProducts.slice(index)
    ];

    setProducts(updatedProducts);
    setDraggingItemIndex(null); // Reset drag state
  };

  // Handle adding new product row
  const addProduct = () => {
    setProducts([
      ...products,
      { id: (products.length + 1).toString(), productName: '', discount: '' }
    ]);
  };


  // Function to open the modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  return (
    <>
      <Header />
      <div className="mt-6 mx-auto w-1/2">
        <h2 className="mb-4 text-xl font-semibold">Add Products</h2>

        {/* Header Section for Product and Discount Labels */}
        <div class="grid grid-cols-2 gap-4">
          <p className="ml-2">Product</p>
          <p className="ml-2">Discount</p>
          {products.map((product, index) => (
            <>
              <div key={product?.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)} className="ml-2 cursor-pointer">
                <div className="flex items-center">
                  <MdDragIndicator size={25} />
                  <span className="mr-2">{index + 1}.</span>

                  {/* Input Section */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder={product.productName}
                      className="w-full border border-gray-300 rounded p-2 cursor-pointer"
                      onClick={() => openModal(product)} // Open modal on input click
                    />
                    <HiPencil size={20}
                      className="absolute left-80 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
              {/* Discount Button Section (Placed Below Discount Text) */}
              <div className="ml-2">
                <button className="flex items-center p-2 bg-green-600 text-white rounded">
                  Add Discount
                </button>
              </div>
            </>
          ))}
        </div>
        <div className="ml-4">
          <button
            onClick={addProduct}
            className="px-16 py-3 mt-4 ml-80 border-2 border-emerald-600 text-emerald-600 rounded hover:bg-emerald-800 hover:text-white hover:border-none"
          >
            Add Product
          </button>
        </div>
      </div>

      <ProductPickerModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        productName={selectedProduct?.productName}
      />
    </>
  )
}

export default App
