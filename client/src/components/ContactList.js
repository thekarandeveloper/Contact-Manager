import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { MdOutlineEdit } from "react-icons/md";
import { useState } from "react";
function ContactList({ contacts, editContact, setContacts }) {

  const [selectContact, setSelectContact] = useState("")
  // const [contact, setContact] = useState(null)
  var selectedContactIdList = []
  const handleDelete = async (id) => {
    await axios.delete(`/api/contacts/${id}`);
    setContacts(contacts.filter((contact) => contact._id !== id));
  };
  const handleBulkDelete = async () => {
    // await axios.delete(`/api/contacts/`);
    await axios.delete('/api/contacts')
    setContacts([]);
     document.getElementById("bulkDeleteButton").style.display = "none"
  };
  function handleContactSelection(contactID){


    if (selectedContactIdList.includes(contactID)){
      selectedContactIdList.pop(contactID)
    } else{
      selectedContactIdList.push(contactID)
    }
   

    if(selectedContactIdList.length >= 2 ){
        document.getElementById("bulkDeleteButton").style.display = "block"
       
        document.querySelectorAll(".editButton").forEach((selectedRow) => { 
          selectedRow.style.visibility = "hidden"
          
        
  
         });
    } else{
       document.getElementById("bulkDeleteButton").style.display = "none"
       document.querySelectorAll(".editButton").forEach((selectedRow) => { 

         selectedRow.style.visibility = "visible"
        
      

       });
       
    }

  }

  function handleBulkSelection() {
    document.querySelectorAll(".deleteButton").forEach((checkbox) => { 

      checkbox.checked = !checkbox.checked
      
      
        document.getElementById("bulkDeleteButton").style.display = checkbox.checked ? "block" : "none"
     

     })
  }

  return (
    <section className="overflow-hidden rounded-lg">
      <table className="table-fixed contact-list w-full bg-white rounded-lg ">
        <thead>
        <tr className="bg-[#e6e6e6cf] rounded-md">
          <th className="py-4 w-12">
            <input className="w-4 h-4 cursor-pointer" onClick={handleBulkSelection} type="checkbox" />
          </th>
          <th className="w-20 ">S.No</th>
          <th className="w-25 ">Name</th>
          <th className="w-30 ">Email</th>
          <th className="w-25 ">Phone</th>
          <th className="w-20 "></th>
          <th className="w-20 "><button id="bulkDeleteButton" onClick={handleBulkDelete} className="p-2 flex flex-row border border-1 rounded-md bg-[#f64e4e] text-white hidden"> <MdDeleteOutline /></button></th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr className="border-0 bottom-2 hover:bg-[#e6e6e633] cursor-pointer h-20 border-b-[0.5px] border-[#dbdbdbee]" key={contact._id} >
              <td  className="py-4 text-gray-500 w-20">
                <input className="deleteButton w-4 h-4 cursor-pointer" type="checkbox" key={contact._id} onClick={() => {handleContactSelection(contact._id)}} />
              </td>
              <td className="text-gray-600 ">{index+1}</td>
              <td className="text-gray-600 ">{contact.name}</td>
              <td className="text-gray-600 ">{contact.email}</td>
              <td className="text-gray-600 ">{contact.phone}</td>
              <td  className="text-gray-400"><button id="editButton" onClick={() => editContact(contact)} className=" editButton p-2 pl-4 flex flex-row border border-1 rounded-md hover:bg-[#484848] hover:text-white"> Edit&emsp;</button></td>
              <td className="text-gray-400 "><button onClick={() => handleDelete(contact._id)} className="p-2 flex flex-row border border-1 rounded-md hover:bg-[#484848] hover:text-white"> <MdDeleteOutline /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ContactList;
