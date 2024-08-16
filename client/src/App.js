import React, {useState, useEffect, useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal"
import ContactList from "./components/ContactList";
import './index.css';
import axios from "axios";

function App() {


// Needed Variables

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [heading, setHeading] = useState("")
  const [newkey, setNewKey] = useState("")
  const [contacts, setContacts] = useState([])
  const [contactToUpdate, setContactToUpdate] = useState(null)
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [hasMore, setHasMore] = useState(true);
  const scrollableContaineRef = useRef(null)
  const [totalContacts, setTotalContacts] = useState(0)
 const [searchTerm, setSearchTerm] = useState("")
 const [duplicateIds, setDuplicateIds] = useState(new Set());
  const [checkedIds, setCheckedIds] = useState(new Set());
  // Functions 
  const toggleModal = (currentHeading="", currentkey="")=>{
    setIsModalVisible(!isModalVisible)
    setHeading(currentHeading)
    setNewKey(currentkey)
  }
  const editContact = (contact) =>{
    toggleModal("Edit Contact", "edit")
    setContactToUpdate(contact)
  }

  // Fetch Contacts

  const fetchContacts = async (page = 1, searchTerm = '') => {
    try {
        const response = await axios.get('/api/contacts', {
            params: {
                page: page,
                limit: limit,
                search: searchTerm
            }
        });

        const { contacts: newContacts, total, totalPages } = response.data;
        setTotalContacts(total)
        if (newContacts.length === 0) {
            setHasMore(false);
        } else {

          setContacts(prevContacts => {
            return page === 1 ? newContacts : [[...prevContacts,...newContacts]]
          })
            // If you want to filter contacts based on the search term,
            // you might want to update filteredContacts separately
            setFilteredContacts(prevContacts => {
              return page === 1 ? newContacts : [[...prevContacts,...newContacts]]
            });
            setPage(page)
            // Optionally, you can update pagination-related states if needed
            // setTotal(total);
            // setTotalPages(totalPages);
        }
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
};


  const handleSearch = async (searchString) =>{
   
    
    setSearchTerm(searchString.toLowerCase())
    console.log("This is search term", searchTerm)
    try {

      if (searchTerm === "") {
        setFilteredContacts(contacts)
      } else if (searchTerm !== ""){
        const response = await axios.get('/api/contacts', {
          params:{
            search: searchTerm,
            page:1,
            limit:20
          }
        });

      const filteredData = response.data.contacts
      
      setFilteredContacts(filteredData)
      setContacts(filteredData)
      console.log("This is filtered Data", filteredData)
    }}
    catch (error) {
      console.error("Error Fetching Contacts", error);
    }
  };
  

  // Fetch Duplicates

  const fetchDuplicates = async () =>{
    try{
      const response = await axios.get('/api/contacts/duplicates');
      const {duplicates, summary} = response.data
      console.log("Duplicate contacts:", duplicates);
      console.log("Summary of duplicates:", summary);
    } catch (error){
      console.error("Error Fetching Duplicates", error);
    }
  }


  // Fetch Function on Intital Render

  useEffect(()=>{
    fetchContacts(page);
  },[page]);

  return (
    <div className="App">
      <Navbar toggleModal={toggleModal} totalContacts = {totalContacts} handleSearch={handleSearch} />
      <ContactList ref={scrollableContaineRef} contacts={filteredContacts} editContact={editContact} setContacts={setFilteredContacts} searchTerm={searchTerm} checkedIds={checkedIds} />
      {isModalVisible && <Modal heading={heading} selectedKey={newkey} toggleModal={toggleModal} fetchContacts={fetchContacts} contactToUpdate={contactToUpdate} allContacts={contacts}  refname={scrollableContaineRef} filteredContacts={filteredContacts} editContact={editContact} setFilteredContacts={setFilteredContacts} searchTerm={searchTerm}/>}
    </div>
  );
}

export default App;
