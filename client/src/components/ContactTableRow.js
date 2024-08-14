import React from "react";
import { MdDeleteOutline } from "react-icons/md";

function ContactTableRow({ index, style, data, editContact, handleDelete, handleContactSelection }) {
  const contact = data[index];

  return (
    <div style={{ ...style}} className="w-[100%] flex flex-row items-center justify-between px-8">
     
     <div className="w-20 flex flex-shrink-0 justify-between">
     <input className="deleteButton h-4 cursor-pointer " type="checkbox" key={contact._id} onClick={() => {handleContactSelection(contact._id)}} />
     <div className="w-10 flex flex-shrink-0 justify-center">{index+1}</div>
     </div>
      
      <div className="w-60 flex flex-shrink-0 justify-center">{contact.name}</div>
      <div className="w-48 flex flex-shrink-0 justify-center">{contact.email}</div>
      <div className="w-84 flex flex-shrink-0 justify-center">{contact.phone}</div>
      <div className="w-60 flex flex-shrink-0 text-gray-400 justify-end flex-row content-between">
        <button
          id="editButton"
          onClick={() => editContact(contact)}
          className=" mx-2 editButton p-2 pl-4 flex flex-row justify-center items-center  border border-1 rounded-md hover:bg-[#484848] hover:text-white"
        >
          {" "}
          Edit&emsp;
        </button>
        <button
          onClick={() => handleDelete(contact._id)}
          className="p-2  mx-2 flex flex-row border border-1 rounded-md justify-center items-center hover:bg-[#484848] hover:text-white"
        >
          {" "}
          <MdDeleteOutline />
        </button>
      </div>
      
    </div>
  );
}

export default ContactTableRow;
