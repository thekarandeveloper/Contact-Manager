import React, { useState, useCallback } from 'react'
import { IoMdAddCircle } from "react-icons/io";
import { FaFileImport } from "react-icons/fa";
import debounce from 'lodash.debounce';
function Navbar({toggleModal, totalContacts, handleSearch}) {

  const [searchString, setSearchString] = useState("");

  const debouncedSearch = useCallback(
    debounce((value) => handleSearch(value, 10),[]
  ));

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchString(value)
    // handleSearch(value)
    debouncedSearch(value)
    console.log("Search term from input", value)
  }
  
  return (
    <section className="flex flex-wrap items-center justify-between mt-8">
    {/* Contacts Heading */}
    <div className="brand text-[1.75rem] font-extrabold leading-10 text-left ">
      Contacts
    </div>
    
    {/* Search Bar */}
    <div className="searchBar w-full md:w-7/12 order-4 my-4 md:order-none">
      <input 
        id="search-input" 
        className="search-input p-2 w-full border border-1 border-[#cacaca] border-opacity-2 rounded-full md:rounded-md" 
        type="text" 
        placeholder={`Search in ${totalContacts} Contacts`} 
        value={searchString} 
        onChange={handleChange}
      />
    </div>
  
    {/* Action Buttons */}
    <div className="controllers flex flex-wrap md:flex-nowrap flex-row h-full space-x-4">
      <button 
        className="importButton px-2 md:px-4 md:mx-0 py-2 bg-[#0060ef] text-white rounded-full md:rounded-md flex items-center border-2 border-[#0060ef] hover:border-black"
        onClick={() => toggleModal('Add Contact', "add")}
      >
        <span className="hidden md:block">Add</span> <IoMdAddCircle />
      </button>
      
      <button 
        className="importButton px-2 md:px-4 md:mx-0 py-2 bg-[#0060ef] text-white rounded-full md:rounded-md flex items-center border-2 border-[#0060ef] hover:border-black"
        onClick={() => toggleModal('Import Contacts', "import")}
      >
        <span className="hidden md:block">Import</span> <FaFileImport />
      </button>
      
      <button 
        className="duplicateButton px-4 py-2 bg-[#0d1e38] text-white rounded-full md:rounded-md flex items-center"
        onClick={() => toggleModal('Duplicate Contacts', "delete-duplicates")}
      >
        <span className="hidden md:block">Find Duplicates</span>
      </button>
    </div>
  </section>
  
  )
}

export default Navbar