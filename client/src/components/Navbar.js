import React, { useState, useCallback } from 'react'
import { IoMdAddCircle } from "react-icons/io";
import { FaFileImport } from "react-icons/fa";
import debounce from 'lodash.debounce';
function Navbar({toggleModal, totalContacts, handleSearch}) {

  const [searchString, setSearchString] = useState("");

  const debouncedSearch = useCallback(
    debounce((value) => handleSearch(value, 300),[]
  ));

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchString(value)
    debouncedSearch(value)
    console.log("Search term", value)
  }
  
  return (
    <section className='navbar-container flex flex-row justify-between'>
        <div className='brand text-[1.75rem] font-extrabold flex content-center justify-between leading-10'>Contacts</div>
        <div className='searchBar w-7/12 h-full'> <input id="search-input" className='search-input  p-2 w-full border border-1 border-[#cacaca] border-opacity-2 rounded-md'  type='text' placeholder={`Search in ${totalContacts.length} Contacts`} value={searchString} onChange={handleChange}/></div>
        <div className='controllers flex flex-row h-full'>
            <button className='importButton px-4 py-2 mx-4 bg-[#0060ef] text-white rounded-md flex flex-row items-center border-2 border-[#0060ef] hover:border-black' onClick={() => toggleModal('Add Contact', "add")}>Add &ensp; <IoMdAddCircle /></button>
            <button className='importButton px-4 py-2 mx-4 bg-[#0060ef] text-white rounded-md flex flex-row items-center border-2 border-[#0060ef] hover:border-black' onClick={() => toggleModal('Import Contacts', "import")}>Import &ensp; <FaFileImport /></button>
            <button onClick={() => toggleModal('Duplicate Contacts', "duplicates")} className='duplicateButton px-4 py-2 ml-2 bg-[#0d1e38] text-white border border-1 rounded-md flex flex-row items-center'>Find Duplicates</button>
            
        </div>
    </section>
  )
}

export default Navbar