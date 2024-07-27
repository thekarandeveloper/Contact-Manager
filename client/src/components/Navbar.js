import React from 'react'
import { IoMdAddCircle } from "react-icons/io";
import { FaFileImport } from "react-icons/fa";
function Navbar() {
  return (
    <section className='navbar-container flex flex-row justify-between'>
        <div className='brand text-xl font-medium'>Contacts</div>
        <div className='searchBar w-7/12'> <input className='search-input  p-2 w-full border border-1 border-white border-opacity-0 rounded-md'  type='text' placeholder='Search'/></div>
        <div className='controllers flex flex-row'>
            <button className='importButton px-4 py-2 mx-4 bg-[#0060ef] text-white border border-1 rounded-md flex flex-row items-center'>Add &ensp; <IoMdAddCircle /></button>
            <button className='importButton px-4 py-2 ml-2 bg-[#0060ef] text-white border border-1 rounded-md flex flex-row items-center'>Import &ensp; <FaFileImport /></button>
            <button className='importButton px-4 py-2 ml-2 bg-[#0d1e38] text-white border border-1 rounded-md flex flex-row items-center'>Find Duplicates</button>
            
        </div>
    </section>
  )
}

export default Navbar