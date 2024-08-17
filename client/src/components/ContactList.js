import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useState } from "react";
import React, { useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import ContactTableRow from "./ContactTableRow";
import PropTypes from "prop-types"

function ContactList({ contacts, editContact, setContacts, searchTerm, checkedIds }) {
  const listRef = useRef(null)
  
  const [selectContact, setSelectContact] = useState("");
  const [allSelected, setAllSelected] = useState(false);
  var selectedContactIdList = [];
  const rowHeight = 50;
  const height = 600;
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);
  const loadMoreContacts = async (searchString = searchTerm) => {
    if (hasMore) {
        try {
            const nextPage = page + 1;
            const searchTerm = searchString.toLowerCase(); // Normalize the search term
            
            const response = await axios.get(`https://cm-backend-service-8dc88f99d89b.herokuapp.com/api/contacts`, {
                params: {
                    page: nextPage,
                    limit: 20,
                    search: searchTerm
                }
            });

            const newContacts = response.data.contacts;
            console.log("Full Loadmore Contact list", response.data)
            if (newContacts.length > 0) {
                setContacts(prevContacts => [...prevContacts, ...newContacts]);
                setPage(nextPage); // Update the page state to the next page
            } else {
                setHasMore(false); // No more contacts to load
            }
        } catch (error) {
            console.error("Error fetching more contacts:", error);
        }
    }
};



  const handleScroll = ({scrollOffset}) => {

    const container = listRef.current;

    if (container && container.scrollHeight - scrollOffset <= height * 2.5){
      loadMoreContacts()
    }
  
  }
    
  const handleDelete = async (id) => {
    await axios.delete(`https://cm-backend-service-8dc88f99d89b.herokuapp.com/api/contacts/${id}`);
    setContacts(prevContacts => prevContacts.filter((contact) => contact._id !== id));
  };
  const handleBulkDelete = async () => {
    await axios.delete("https://cm-backend-service-8dc88f99d89b.herokuapp.com/api/contacts");
    setContacts([]);
    document.getElementById("bulkDeleteButton").style.display = "none";
  };

  function handleBulkDeleteSelection() {
    if (allSelected) {
      handleBulkDelete();
    } else {
      selectedContactIdList.forEach((selectedContactID) => {
        console.log(selectedContactID);
        handleDelete(selectedContactID);
      });
    }
    document.getElementById("bulkDeleteButton").style.display = "none";
    selectedContactIdList = [];
    document.querySelectorAll(".editButton").forEach((selectedRow) => {
      selectedRow.style.visibility = "visible";
    });
  }

  function handleContactSelection(e) {
    const selectedRow = e.target
    console.log(selectedRow);

    if (selectedRow.checked){
      selectedContactIdList.push(selectedRow.dataset.id);
    } else if (!selectedRow.checked){
      selectedContactIdList.pop(selectedRow.dataset.id);
    }
    console.log(selectedContactIdList)
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

  function handleBulkSelection(e) {

    const checkBoxes = document.querySelectorAll(".deleteButton");
   

    checkBoxes.forEach(checkbox => {
      checkbox.checked = e.target.checked;
    })


   document.getElementById("bulkDeleteButton").style.display = e.target.checked ? "block" : "none";
    
  }
  // Conditional height style
  const tableStyle = {
    height: "80vh", // Adjust '400px' as needed
    backgroundImage:"none",
    // contacts.length === 0 ? `url("../assets/404.svg")` : "none",
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
                onClick={(e) => handleBulkDeleteSelection(e)}
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
                checkedIds = {checkedIds}
              ></ContactTableRow>
            )}
          </List>
        </div>
      </div>
    </section>
  );
}
// ContactList.propTypes = {
//   contacts: PropTypes.array.isRequired,
//   editContact: PropTypes.func.isRequired,
//   setContacts: PropTypes.func.isRequired,
// };
export default ContactList;
