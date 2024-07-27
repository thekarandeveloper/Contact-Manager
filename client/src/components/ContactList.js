import axios from "axios";
import { MdOutlineEdit } from "react-icons/md";
function ContactList({ contacts }) {
//   const handleDelete = async (id) => {
//     await axios.delete(`/api/contacts/${id}`);
//     setContacts(contacts.filter((contact) => contact._id !== id));
//   };

  return (
    <section>
      <table className="contact-list w-full bg-white border border-1 border-white rounded-xl ">
        <thead >
          <th className="py-4">
            <input type="checkbox" />
          </th>
          <th>S.No</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th></th>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr className="border-0 bottom-2">
              <td  className="py-4 text-gray-500">
                <input type="checkbox" key={contact._id} />
              </td>
              <td className="text-gray-600">{index+1}</td>
              <td className="text-gray-600">{contact.name}</td>
              <td className="text-gray-600">{contact.email}</td>
              <td className="text-gray-600">{contact.phone}</td>
              <td className="text-gray-400 "><MdOutlineEdit className="transition-all hover:cursor-pointer text-xl hover:bg-[#0060ef] hover:text-white p-1 rounded-xl"/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ContactList;
