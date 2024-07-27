import { useState, useEffect } from "react";
import axios from "axios";

function ContactForm({ contact, setContact, setContacts }) {
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

  // Function to fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get("/api/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newContact = { name, email, phone };

    try {
      if (contact) {
        console.log("Trying to Add Contact");
        // Update existing contact
        await axios.put(`/api/contacts/${contact._id}`, newContact);
      } else {
        // Add new contact
        console.log("Trying to Add Contact");
        await axios.post("/api/contacts", newContact);
      }
      // Clear form fields
      setName("");
      setEmail("");
      setPhone("");
      setContact(null);
      // Fetch updated contacts
      fetchContacts();
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
