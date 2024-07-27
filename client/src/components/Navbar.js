import React, { useState } from 'react'
import { IoMdAddCircle } from "react-icons/io";
import { FaFileImport } from "react-icons/fa";
function Navbar({toggleModal}) {

  

  return (
    <section className='navbar-container flex flex-row justify-between'>
        <div className='brand text-xl font-medium'>Contacts</div>
        <div className='searchBar w-7/12'> <input className='search-input  p-2 w-full border border-1 border-white border-opacity-0 rounded-md'  type='text' placeholder='Search'/></div>
        <div className='controllers flex flex-row'>
            <button className='importButton px-4 py-2 mx-4 bg-[#0060ef] text-white rounded-md flex flex-row items-center border-2 border-[#0060ef] hover:border-black' onClick={() => toggleModal('Add Contact', "add")}>Add &ensp; <IoMdAddCircle /></button>
            <button className='importButton px-4 py-2 mx-4 bg-[#0060ef] text-white rounded-md flex flex-row items-center border-2 border-[#0060ef] hover:border-black' onClick={() => toggleModal('Import Contacts', "import")}>Import &ensp; <FaFileImport /></button>
            <button className='importButton px-4 py-2 ml-2 bg-[#0d1e38] text-white border border-1 rounded-md flex flex-row items-center'>Find Duplicates</button>
            
        </div>
    </section>
  )
}

export default Navbar