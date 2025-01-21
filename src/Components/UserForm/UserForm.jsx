import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import styles from '../UserForm/UserForm.module.css'; 

// UserForm component to add or edit user details
const UserForm = ({ user, onSave, onCancel }) => {
  // Initializing form data with empty values
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
  });

  // useEffect runs when the component is loaded or when 'user' prop changes
  useEffect(() => {
    if (user) {
      // If there's a user, set form data to the user details (for editing)
      setFormData(user);
    }
  }, [user]); // Dependency on 'user' so it runs when 'user' changes

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Get the input field name and its value
    // Update the form data with the new value
    setFormData((prevData) => ({
      ...prevData, // Keep the old data
      [name]: value, // Update the value of the field that was changed
    }));
  };

  // Handle form submission (saving data)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the page from reloading when submitting the form
    try {
      if (user) {
        // If there's a user (editing an existing user)
        const response = await axios.put(
          `https://jsonplaceholder.typicode.com/users/${user.id}`, // URL to update the user
          formData // Send the form data as the updated user info
        );
        onSave(response.data); // Call onSave with the updated user data
      } else {
        // If there's no user (creating a new user)
        const response = await axios.post(
          `https://jsonplaceholder.typicode.com/users`, // URL to create a new user
          formData // Send the form data as the new user info
        );
        onSave(response.data); // Call onSave with the newly created user data
      }
    } catch (error) {
      // If there's an error, log it
      console.error('Failed to save user:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}> {/* Form to add/edit a user */}
        <h3>{user ? 'Edit User' : 'Add New User'}</h3> {/* Title changes based on whether editing or adding a user */}
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name} // Set the input value to form data
            onChange={handleChange} // Call handleChange when the user types
            required // Make the field required
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username} // Set the input value to form data
            onChange={handleChange} // Call handleChange when the user types
            required // Make the field required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email} // Set the input value to form data
            onChange={handleChange} // Call handleChange when the user types
            required // Make the field required
          />
        </label>
        <div className={styles.buttons}>
          <button type="submit">Save</button> {/* Button to save the form */}
          <button type="button" onClick={onCancel}> {/* Button to cancel */}
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm; // Export the UserForm component
