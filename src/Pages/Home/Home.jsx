import React from 'react';
import UserList from '../../Components/UserList/UserList';
import UserForm from '../../Components/UserForm/UserForm';
import styles from '../Home/Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>User Management</h1>
      <UserList />
      <h2 className={styles.subHeading}>Create New User</h2>
      <UserForm onSuccess={() => window.location.reload()} />
    </div>
  );
};

export default Home;

