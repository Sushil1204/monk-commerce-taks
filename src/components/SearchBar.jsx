import React from 'react'
import { GoSearch } from 'react-icons/go'

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
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
    )
}

export default SearchBar