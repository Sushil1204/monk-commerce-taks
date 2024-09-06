import Header from "./components/Header"


function App() {
  return (
    <>
      <Header />
      <div className="mt-6 mx-auto w-1/2">
        <p className="text-base font-medium">Add Product</p>
        <div class="grid grid-cols-2 gap-4">
          <div>Product</div>
          <div>Discount</div>

        </div>
      </div>
    </>
  )
}

export default App
