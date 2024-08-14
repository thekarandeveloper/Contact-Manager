import React, {useState, useEffect} from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal"
import ContactList from "./components/ContactList";
import './index.css';
import axios from "axios";

function App() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [heading, setHeading] = useState("")
  const [newkey, setNewKey] = useState("")
  const [contacts, setContacts] = useState([])
  const [contactToUpdate, setContactToUpdate] = useState(null)
  const [filteredContacts, setFilteredContacts] = useState([]);
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

  const fetchContacts = async() =>{
    const response = await axios.get("/api/contacts");
    setContacts(response.data);
    setFilteredContacts(response.data);
  }

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
    fetchContacts();
  },[]);


  return (
    <div className="App">
      <Navbar toggleModal={toggleModal} totalContacts = {contacts} handleSearch={handleSearch}/>
      <ContactList contacts={filteredContacts} editContact={editContact} setContacts={setContacts}/>
      {isModalVisible && <Modal heading={heading} selectedKey={newkey} toggleModal={toggleModal} fetchContacts={fetchContacts} contactToUpdate={contactToUpdate} allContacts={contacts}/>}
    </div>
  );
}

export default App;
