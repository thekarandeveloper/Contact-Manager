import React from "react";
import axios from "axios";
function FindDuplicates({contacts, fetchChanges, toggleModal}) {
 

const handleSelectedDelete = async (id) => {

  await axios.delete(`/api/contacts/${id}`);
  fetchChanges()
}

  const seen = new Set();
  const duplicates = new Set();
  const duplicateContacts = []
  var selectedContactIdList = []
  function checkDuplicates() {

   
    for (const item of contacts) {
      
      if (seen.has(item.phone)){
        duplicates.add(item._id)
      } else{
        seen.add(item.phone)
      }
    }
    console.log(duplicates);
    return Array.from(duplicates)
  }


  function getDuplicates(arr) {


    arr =  checkDuplicates()


    contacts.forEach((item)=> {
      arr.forEach((duplicateitem)=>{
        if (item._id === duplicateitem){
          duplicateContacts.push(item)
        }
      })
     
  
    })
    console.log(duplicateContacts);
  }

  function deleteContacts() {

    selectedContactIdList.forEach((contactId)=>{

      handleSelectedDelete(contactId)
      fetchChanges()
    })
    fetchChanges()
    toggleModal()
  }
  getDuplicates()
  function handleBulkSelection() {
    document.querySelectorAll(".duplicateDeleteButton").forEach((checkbox) => { 

      checkbox.checked = !checkbox.checked
             
        duplicateContacts.forEach((item)=>{

          handleSelectedDelete(item._id)

        })

     })}


  function handleContactSelection(contactID){


      if (selectedContactIdList.includes(contactID)){
        selectedContactIdList.pop(contactID)
      } else{
        selectedContactIdList.push(contactID)
      }
      
    }
  return (
    <section className="m-0 ">
    <table className="table-fixed w-full bg-white rounded-lg contact-list h-full overflow-hidden rounded-md">
      <thead>
      <tr className="bg-[#e6e6e6cf] rounded-md">
        <th className="py-4 w-12">
          <input className="w-4 h-4 cursor-pointer" onClick={handleBulkSelection} type="checkbox" />
        </th>
        <th className="w-20 ">S.No</th>
        <th className="w-25 ">Name</th>
        <th className="w-25 ">Phone</th>
        </tr>
      </thead>
      <tbody>
        {duplicateContacts.map((contact, index) => (
          <tr className="border-0 bottom-2 hover:bg-[#e6e6e633] cursor-pointer h-20 border-b-[0.5px] border-[#dbdbdbee]" key={contact._id} >
            <td  className="py-4 text-gray-500 w-20">
              <input className="duplicateDeleteButton w-4 h-4 cursor-pointer" type="checkbox" key={contact._id} onClick={() => {handleContactSelection(contact._id)}} />
            </td>
            <td className="text-gray-600 ">{index+1}</td>
            <td className="text-gray-600 ">{contact.name}</td>
           
            <td className="text-gray-600 ">{contact.phone}</td>
            
          </tr>
        ))        }
      </tbody>
    </table> 
    <button  className="border border-1 text-md p-2 w-full mt-8 rounded-md bg-[#0060ef] text-white font-medium" type="submit" onClick={deleteContacts}>Delete Duplicates</button>
  </section>
  );
}


export default FindDuplicates;
