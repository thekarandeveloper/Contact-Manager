import React from "react";
import ContactForm from "./ContactForm";
import UploadCSV from "./UploadCSV";
import { IoMdClose } from "react-icons/io";
function Modal({ heading }) {
  return (
    <div className="bg-[#62626260] fixed top-0 w-full min-h-[100vh] flex justify-center items-center ">
      <div className="modal bg-white w-6/12 min-h-auto border-2 border-white rounded-md">
        <div className="modal-header py-4 border-b-2 text-md font-medium flex flex-row items-center justify-between px-6">
          <div className="heading-name">Add</div>
          <div className="heading-button transition-all bg-white text-xl hover:bg-red-600 hover:cursor-pointer rounded-md p-2 hover:text-white">
            <IoMdClose />
          </div>
        </div>
        <div className="modal-body p-6">
          {/* <ContactForm></ContactForm> */}
          <UploadCSV></UploadCSV>
        </div>
      </div>
    </div>
  );
}

export default Modal;
