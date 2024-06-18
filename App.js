import React, { useState, Fragment } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import data from "./db.json";
import EditableRow from "./components/EditableRow";
import ReadOnlyRow from "./components/ReadOnlyRow";

const App = () => {
  const [contacts, setContacts] = useState(data);
  const [addFormData, setAddFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [editContactId, setEditContactId] = useState(null);
  const [errors, setErrors] = useState({
    phoneNumber: "",
    email: "",
  });

  const handleAddFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleEditFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    if (!validateForm(addFormData)) {
      return;
    }

    const newContact = {
      id: nanoid(),
      fullName: addFormData.fullName,
      address: addFormData.address,
      phoneNumber: addFormData.phoneNumber,
      email: addFormData.email,
    };

    const newContacts = [...contacts, newContact];
    setContacts(newContacts);
    setAddFormData({ fullName: "", address: "", phoneNumber: "", email: "" });
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    if (!validateForm(editFormData)) {
      return;
    }

    const editedContact = {
      id: editContactId,
      fullName: editFormData.fullName,
      address: editFormData.address,
      phoneNumber: editFormData.phoneNumber,
      email: editFormData.email,
    };

    const newContacts = [...contacts];
    const index = contacts.findIndex((contact) => contact.id === editContactId);
    newContacts[index] = editedContact;

    setContacts(newContacts);
    setEditContactId(null);
  };

  const validateForm = (formData) => {
    const errors = {};
    if (formData.phoneNumber.length < 10) {
      errors.phoneNumber = "Phone number cannot exceed 10 digits.";
    }

    if (!formData.email.includes("@")) {
      errors.email = "Email must contain an '@' symbol.";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    const formValues = {
      fullName: contact.fullName,
      address: contact.address,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    const newContacts = [...contacts];
    const index = contacts.findIndex((contact) => contact.id === contactId);
    newContacts.splice(index, 1);
    setContacts(newContacts);
  };

  return (
    <div className="app-container">
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <Fragment key={contact.id}>
                {editContactId === contact.id ? (
                  <EditableRow
editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                    errors={errors}
                  />
                ) : (
                  <ReadOnlyRow
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>

      <h2>Add a contact</h2>
      <form onSubmit={handleAddFormSubmit}>
        <input
          type="text"
          name="fullName"
          required="required"
          placeholder="Enter a name"
          value={addFormData.fullName}
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="address"
          required="required"
          placeholder="Enter an address"
          value={addFormData.address}
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="phoneNumber"
          required="required"
          placeholder="Enter a phone number"
          value={addFormData.phoneNumber}
          onChange={handleAddFormChange}
        />
        {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
        <input
          type="email"
          name="email"
          required="required"
          placeholder="Enter an email"
          value={addFormData.email}
          onChange={handleAddFormChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
        <button type="submit">Add</button>
      </form>
    </div>
  );
};


export default App;