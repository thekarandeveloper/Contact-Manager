import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useState } from "react";
import React, { useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import ContactTableRow from "./ContactTableRow";
import PropTypes from "prop-types"

function ContactList({ contacts, editContact, setContacts }) {
  const listRef = useRef(null)
  const [selectContact, setSelectContact] = useState("");
  const [allSelected, setAllSelected] = useState(false);
  var selectedContactIdList = [];
  const rowHeight = 50;
  const height = 600;
 
  const [hasMore, setHasMore] = useState(true);
  const loadMoreContacts = async () => {
    if (hasMore) {
      try {
        // Fetch more contacts here and update the list
        const response = await axios.get('/api/contacts'); // Adjust URL and parameters as needed
        const { contacts: newContacts } = response.data;
        if (newContacts.length > 0) {
          setContacts(prevContacts => [...prevContacts, ...newContacts]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching more contacts:", error);
      }
    }
  };


  const handleScroll = ({scrollOffset}) => {

    const container = listRef.current;

    if (container && container.scrollHeight - scrollOffset <= height * 1.5){
      loadMoreContacts()
    }
  
  }
  // useEffect(() => {
  //   const container = listRef.current

  //   if (container){
  //     container.addEventListener('scroll', handleScroll)
  //   }
  //   return () => {
  //     if(container){
  //       container.removeEventListener('scroll', handleScroll)
  //     }
  //   };

  // }, [contacts])

  
  const handleDelete = async (id) => {
    await axios.delete(`/api/contacts/${id}`);
    setContacts(contacts.filter((contact) => contact._id !== id));
  };
  const handleBulkDelete = async () => {
    await axios.delete("/api/contacts");
    setContacts([]);
    document.getElementById("bulkDeleteButton").style.display = "none";
  };

  function handleBulkDeleteSelection() {
    if (allSelected) {
      handleBulkDelete();
    } else {
      selectedContactIdList.forEach((selectedContactID) => {
        console.log(selectedContactIdList);
        handleDelete(selectedContactID);
      });
    }
    document.getElementById("bulkDeleteButton").style.display = "none";
    selectedContactIdList = [];
    document.querySelectorAll(".editButton").forEach((selectedRow) => {
      selectedRow.style.visibility = "visible";
    });
  }

  function handleContactSelection(contactID) {
    if (selectedContactIdList.includes(contactID)) {
      selectedContactIdList.pop(contactID);
    } else {
      selectedContactIdList.push(contactID);
    }

    if (selectedContactIdList.length >= 2) {
      document.getElementById("bulkDeleteButton").style.display = "block";

      document.querySelectorAll(".editButton").forEach((selectedRow) => {
        selectedRow.style.visibility = "hidden";
      });
    } else {
      document.getElementById("bulkDeleteButton").style.display = "none";
      document.querySelectorAll(".editButton").forEach((selectedRow) => {
        selectedRow.style.visibility = "visible";
      });
    }
  }

  function handleBulkSelection() {
    setAllSelected(true);
    document.querySelectorAll(".deleteButton").forEach((checkbox) => {
      checkbox.checked = !checkbox.checked;

      document.getElementById("bulkDeleteButton").style.display =
        checkbox.checked ? "block" : "none";
    });
  }
  // Conditional height style
  const tableStyle = {
    height: contacts.length === 0 ? "80vh" : "auto", // Adjust '400px' as needed
    backgroundImage:
      contacts.length === 0 ? `url("../assets/404.svg")` : "none",
    backgroundSize: "15%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    transition: "1s",
  };

  return (
    <section className="overflow-hidden rounded-lg h-[80vh]">
      <div
        className="w-full bg-white rounded-lg contact-list flex flex-col"
        style={tableStyle}
      >
        <div className="bg-[#e6e6e6cf] w-[100%] flex flex-row items-center justify-between px-8 pr-14">
          <div className="py-4 w-20 flex flex-shrink-0 justify-between">
            <input
              className="w-4 h-4 cursor-pointer"
              onClick={handleBulkSelection}
              type="checkbox"
            />
            <div className="w-10 flex-shrink font-bold">S.No</div>
          </div>
          
          <div className="w-60 flex flex-shrink-0 justify-center font-bold">Name</div>
          <div className="w-48 flex flex-shrink-0 justify-center font-bold">Email</div>
          <div className="w-84 flex flex-shrink-0 justify-center font-bold">Phone</div>
          <div className="w-60 flex flex-shrink-0 text-gray-400 justify-end flex-row content-between">
          <button
          id="editButton"
          
          className=" mx-2 editButton p-2 pl-4 flex flex-row justify-center items-center  border border-1 rounded-md hover:bg-[#484848] hover:text-white hidden"
        >
          {" "}
          Edit&emsp;
        </button>
            <button
                id="bulkDeleteButton"
                onClick={handleBulkDeleteSelection}
                className="p-2 flex flex-row border border-1 rounded-md bg-[#f64e4e] text-white hidden"
              >
                {" "}
                <MdDeleteOutline />
              </button>
          </div>
        </div>

        <div className="w-[100%] ">
          <List
            height={height}
            itemCount={contacts.length}
            itemSize={rowHeight}
            width="100%"
            onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
    // If the last visible item is the last item in the list
    if (visibleStopIndex === contacts.length - 1) {
      loadMoreContacts();
    }
  }}
            onScroll={handleScroll}
            ref={listRef}
            itemData={{
              contacts,
              editContact,
              handleDelete,
              handleContactSelection,
            
            }
            
            }
          >
            {({ index, style, data }) => (
              <ContactTableRow
                index={index}
                style={style}
                data={data.contacts}
                editContact={data.editContact}
                handleDelete={data.handleDelete}
                handleContactSelection={data.handleContactSelection}
              ></ContactTableRow>
            )}
          </List>
        </div>
      </div>
    </section>
  );
}
ContactList.propTypes = {
  contacts: PropTypes.array.isRequired,
  editContact: PropTypes.func.isRequired,
  setContacts: PropTypes.func.isRequired,
};
export default ContactList;
