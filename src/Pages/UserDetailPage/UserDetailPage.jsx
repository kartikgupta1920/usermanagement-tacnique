import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserForm from '../../Components/UserForm/UserForm';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';
import styles from '../UserDetailPage/UserDetailPage.module.css';

const UserDetailPage = () => {
  const { id } = useParams(); // Get the user ID from the URL params
  const navigate = useNavigate(); // Hook to navigate to different pages
  const [user, setUser] = useState(null); // State to store the fetched user data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store any errors

  // Fetch user details when the component mounts or when the ID changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`); // Fetch user data from API
        setUser(response.data); // Set the user data to state
      } catch (err) {
        setError('Failed to fetch user.'); // Handle any errors during the fetch
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUser();
  }, [id]); // Dependency on 'id' to refetch when it changes

  // Handle user deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`); // Delete the user from the API
      navigate('/'); // Redirect to the home page after deletion
    } catch (error) {
      setError('Failed to delete user.'); // Handle any errors during deletion
    }
  };

  // If the data is still loading, show a loading spinner
  if (loading) return <LoadingSpinner />;
  
  // If there is an error, show the error message
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      {user && ( // If user data exists, show the form and delete button
        <>
          <UserForm user={user} onSuccess={() => navigate('/')} /> {/* Show the form with user data */}
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete {/* Delete button to remove the user */}
          </button>
        </>
      )}
    </div>
  );
};

export default UserDetailPage; 
