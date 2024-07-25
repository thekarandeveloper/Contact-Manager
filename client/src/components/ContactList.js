import axios from 'axios';

function ContactList({contacts, setContact, setContacts}){
    const handleDelete = async(id) =>{
        await axios.delete(`/api/contacts/${id}`);
        setContacts(contacts.filter(contact => contact._id !== id));
    };


    return (
        <ul>
            {
                contacts.map(contact =>(
                    <li key={contact._id}>
                        {contact.name} - {contact.email} - {contact.phone}
                        <button onClick={()=> setContact(contact)}>Edit</button>
                        <button onClick={() => handleDelete(contact._id)}>Delete</button>
                    </li>
                ))
            }
        </ul>
    )

}


export default ContactList;