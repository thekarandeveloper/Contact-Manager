import React from "react";
import ContactForm from "./ContactForm";
import UploadCSV from "./UploadCSV";
import { IoMdClose } from "react-icons/io";
import FindDuplicates from "./FindDuplicates.js";
import ContactList from "./ContactList.js";


function Modal({ heading, selectedKey, action, contactToUpdate, toggleModal, fetchContacts}) {

  function ModalContent({ selectedKey }) {
    switch (selectedKey) {
      case "add":
        return <ContactForm  fetchContactsData={fetchContacts} toggleModal={toggleModal}/>;
      case "edit":
          return <ContactForm  contact={contactToUpdate} fetchContactsData={fetchContacts} toggleModal={toggleModal}/>;
      case "import":
        return <UploadCSV fetchChanges={fetchContacts} toggleModal={toggleModal} />;
      case "delete-duplicates":
          return <FindDuplicates fetchChanges={fetchContacts} toggleModal={toggleModal}></FindDuplicates>
      default:
        return null;
    }
  }


  return (
    <div className="bg-[#62626260] fixed top-0 w-full min-h-[100vh]   flex justify-center items-center ">
      <div className="modal bg-white w-6/12 min-h-auto max-h-[70vh] border-2 border-white rounded-md overflow-hidden">
        <div className="modal-header py-4 border-b-2 text-md font-medium flex flex-row items-center justify-between px-6">
          <div className="heading-name text-xl">{heading}</div>
          <button className="heading-button transition-all bg-gray-200 text-xl hover:bg-red-600 hover:cursor-pointer rounded-md p-2 hover:text-white" onClick={toggleModal}>
            <IoMdClose />
          </button>
        </div>
        <div className="modal-body p-6 h-[80%] overflow-hidden">
         <ModalContent selectedKey={selectedKey}/>
        </div>
      </div>
    </div>
  );
}

export default Modal;
