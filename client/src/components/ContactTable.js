import React from 'react'
import { FixedSizeList as List } from 'react-window';
import ContactTableRow from './ContactTableRow';
import { MdDeleteOutline } from "react-icons/md";
const ContactTable = ({contacts, editContact, handleDelete, handleContactSelection}) => {
    const rowHeight = 50;
    const height = 600;


    return (
        <p>Karan</p>
      //  <div className="table-fixed w-full bg-white rounded-lg contact-list">
      //   <div>
      //   <div className="bg-[#e6e6e6cf] rounded-md">
      //     <div className="py-4 w-12">
      //       <input className="w-4 h-4 cursor-pointer" onClick={handleBulkSelection} type="checkbox" />
      //     </div>
      //     <div className="w-20 ">S.No</div>
      //     <div className="w-25 ">Name</div>
      //     <div className="w-30 ">Email</div>
      //     <div className="w-25 ">Phone</div>
      //     <div className="w-20 "></div>
      //     <div className="w-20 "><button id="bulkDeleteButton" onClick={handleBulkDeleteSelection} className="p-2 flex flex-row border border-1 rounded-md bg-[#f64e4e] text-white hidden"> <MdDeleteOutline /></button>
      //     </div>
      //     </div>
      //   </div>
      //   <div>
      //   <List 
      //   height={height}
      //   itemCount={contacts.length}
      //   itemSize={rowHeight}
      //   width={window.innerWidth}
      //   itemData={{ contacts, editContact, handleDelete, handleContactSelection }}>

      //       {({index, style, data}) => (
      //           <ContactTableRow index={index} style={style} data={data.contacts} editContact={data.editContact} handleDelete={data.handleDelete} handleContactSelection={data.handleContactSelection}></ContactTableRow>
      //       )}

            
      //   </List>
      //   </div>
      // </div>
    )

};

export default ContactTable