import { useState } from 'react';
import styles from './UsernameInput.module.css';

function UsernameInput({
  pictureName,
  milliseconds,
  refreshRecords,
  recordsRef,
  close,
}) {
  const [username, setUsername] = useState('');

  function handleChange(event) {
    setUsername(event.target.value);
  }

  function handleRecordSubmit() {
    const record = {
      username,
      milliseconds,
    };
    fetch(import.meta.env.VITE_API + `pictures/${pictureName}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return alert('Error posting the record.');
        }

        // Close this modal
        close();

        // Fetch the records again and scroll to it
        recordsRef.current.scrollIntoView({
          behavior: 'smooth',
        });
        refreshRecords();
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  return (
    <div className={styles.modal}>
      <span className={styles.prompt}>What is your username?</span>
      <input
        type="text"
        value={username}
        onChange={handleChange}
        className={styles.input}
      />
      <button
        type="button"
        onClick={handleRecordSubmit}
        className={styles['post-btn']}
      >
        Post Record
      </button>
    </div>
  );
}

export default UsernameInput;
