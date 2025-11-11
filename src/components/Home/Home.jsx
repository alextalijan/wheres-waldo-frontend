import PictureSelection from '../PictureSelection/PictureSelection';
import { useState, useEffect } from 'react';

function Home() {
  const { pictures, setPictures } = useState([]);
  const { loadingPictures, setLoadingPictures } = useState(true);
  const { picturesError, setPicturesError } = useState(null);

  // Fetch pictures on initial load
  useEffect(() => {
    fetch(import.meta.env.REACT_APP_API + 'pictures')
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return setPicturesError(response.message);
        }

        setPictures(response.pictures);
      })
      .catch((error) => {
        setPicturesError(error.message);
      })
      .finally(() => setLoadingPictures(false));
  }, []);

  return (
    <>
      <h1>Where's Waldo</h1>
      <p>Choose the picture you want to play.</p>
      {loadingPictures ? (
        <p>Loading...</p>
      ) : picturesError ? (
        <p>picturesError</p>
      ) : (
        <div>
          {pictures.map((picture) => {
            return <PictureSelection key={picture.id} name={picture.name} />;
          })}
        </div>
      )}
    </>
  );
}

export default Home;
