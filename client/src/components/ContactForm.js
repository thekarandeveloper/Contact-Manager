import { useState, useEffect } from "react";
import axios from "axios";

function ContactForm({ contact, setContact, setContacts, fetchContactsData, toggleModal }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Load contact data if 'contact' prop is provided
  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setEmail(contact.email);
      setPhone(contact.phone);
    }
  }, [contact]);

  function fetchContacts() {
    console.log("Fetch Function Called");
    fetchContactsData()
  }
    // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newContact = { name, email, phone };

    try {
      if (contact) {
        console.log("Trying to Update Contact");
        // Update existing contact
        await axios.put(`/api/contacts/${contact._id}`, newContact);
        fetchContacts()
      } else {
        // Add new contact
        console.log("Trying to Add Contact");
        await axios.post("/api/contacts", newContact);
        toggleModal()
      }
      
      // setContact(null);
      // Fetch updated contacts
      console.log("Calling fetchContacts");

      fetchContacts();

      // Clear form fields
      setName("");
      setEmail("");
      setPhone("");
      toggleModal()
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  return (
    <form className="flex flex-col w-full gap-8" onSubmit={handleSubmit}>
      <input
        className="border border-1 text-md p-4 rounded-md"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
       className="border border-1 text-md p-4 rounded-md"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
       className="border border-1 text-md p-4 rounded-md"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
        required
      />
      <button  className="border border-1 text-md p-2 rounded-md bg-[#0060ef] text-white font-medium" type="submit">{contact ? "Update" : "Add"}</button>
    </form>
  );
}

export default ContactForm;
