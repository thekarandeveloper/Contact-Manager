import { useState, useEffect } from "react";
import axios from 'axios';
import ContactList from "../components/ContactList";
import ContactForm from "../components/ContactForm";


function HomePage(){
    const [contacts, setContacts] = useState([]);
    const [contact, setContact] = useState(null);

    const fetchContacts = async () => {
        const res = await axios.get('/api/contacts');
        setContacts(res.data)
    };

    useEffect(()=>{
        fetchContacts();
    },[]);


    return (
        <div>
            {/* <ContactForm contact={contact} setContacts={setContacts} setContact={setContact}></ContactForm> */}
            <ContactList contacts={contacts} setContacts={setContact} setContact={setContacts}></ContactList>

        </div>
    )


}

export default HomePage;