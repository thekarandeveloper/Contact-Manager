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

  const fetchContacts = async (page = 1) => {
    try {
        const response = await axios.get(`/api/contacts?page=${page}&limit=${limit}`);
        const { contacts, total, totalPages } = response.data;

        if (contacts.length === 0) {
            setHasMore(false);
        } else {
            setContacts(prevContacts => [...prevContacts, ...contacts]);
            setFilteredContacts(prevContacts => [...prevContacts, ...contacts]);
        }
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
};

  const handleSearch = (searchString) =>{
    if (searchString === ""){
      setFilteredContacts(contacts)
    } else{
      const lowerCasedSearchString = searchString.toLowerCase();
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(lowerCasedSearchString));
      setFilteredContacts(filtered)
    }
  };
  
  // Fetch Function on Intital Render

  useEffect(()=>{
    fetchContacts(page);
  },[page]);


  return (
    <div className="App">
      <Navbar toggleModal={toggleModal} totalContacts = {contacts} handleSearch={handleSearch}/>
      <ContactList ref={scrollableContaineRef} contacts={filteredContacts} editContact={editContact} setContacts={fetchContacts}/>
      {isModalVisible && <Modal heading={heading} selectedKey={newkey} toggleModal={toggleModal} fetchContacts={fetchContacts} contactToUpdate={contactToUpdate} allContacts={contacts}/>}
    </div>
  );
}

export default App;
