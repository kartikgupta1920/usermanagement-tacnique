import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../UserList/UserList.module.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import UserForm from '../UserForm/UserForm';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const usersPerPage = 10; // Increased number of users per page

  // Load users from localStorage on page load
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users')); // Get users from localStorage
    if (savedUsers) {
      setUsers(savedUsers); // Use saved users if available
      setFilteredUsers(savedUsers); // Set filtered users from saved data
      setLoading(false);
    } else {
      // If no saved data, fetch users from the API
      fetchUsers();
    }
  }, []);

  // Fetch users from API if localStorage has no data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
      localStorage.setItem('users', JSON.stringify(response.data)); // Save users to localStorage
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.username.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      // Update localStorage after deleting
      const updatedUsers = filteredUsers.filter((user) => user.id !== id);
      setFilteredUsers(updatedUsers);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers)); // Save the updated list
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  // Handle save (edit or add user)
  const handleSave = (updatedUser) => {
    let updatedUsers;
    if (currentUser) {
      updatedUsers = filteredUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
    } else {
      updatedUsers = [updatedUser, ...filteredUsers];
    }

    // Update state and localStorage
    setFilteredUsers(updatedUsers);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Save updated users to localStorage
    setIsEditing(false);
    setCurrentUser(null);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>User Management</h2>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by username, name, or email"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button>Search</button>
        </div>
        <button
          className={styles.addUserButton}
          onClick={() => {
            setIsEditing(true);
            setCurrentUser(null); // Add new user
          }}
        >
          + Add New User
        </button>
      </div>

      {isEditing ? (
        <UserForm
          user={currentUser}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className={styles.moreButton}
                      onClick={() => console.log('More details for', user)}
                    >
                      More
                    </button>
                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentUser(user); // Edit user
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(user.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? styles.active : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;

