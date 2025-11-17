import { useParams } from 'react-router-dom';
import styles from './PlayPage.module.css';
import Stopwatch from '../Stopwatch/Stopwatch';
import TargetModal from '../TargetModal/TargetModal';
import { useEffect, useState, useRef } from 'react';

function PlayPage() {
  const { pictureName } = useParams();
  const [isGameActive, setIsGameActive] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [records, setRecords] = useState([]);
  const [milliseconds, setMilliseconds] = useState(0);
  const [isTargetChosen, setIsTargetChosen] = useState(false);
  const [targetCoordinates, setTargetCoordinates] = useState(null);
  const imgRef = useRef(null);

  // Fetch the characters to be found on this page
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `pictures/${pictureName}/appearances`)
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return alert(response.message);
        }

        setCharacters(
          // Filter name and coordinates for each appearance
          response.appearances.map((appearance) => {
            return {
              name: appearance.character.name,
              xCoordinate: appearance.xCoordinate,
              yCoordinate: appearance.yCoordinate,
              isFound: false,
            };
          })
        );
      });
  }, [pictureName]);

  // Fetch top 10 record times for the picture
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `pictures/${pictureName}/records`)
      .then((response) => response.json())
      .then((response) => {
        if (!response.sucess) {
          return alert(response.message);
        }

        setRecords(response.records);
      });
  }, [pictureName]);

  // Check if the game is over after every character change
  useEffect(() => {
    let isGameOver;
    if (characters.length > 0) {
      isGameOver = true;
    } else {
      isGameOver = false;
    }
    for (const character of characters) {
      if (!character.isFound) {
        isGameOver = false;
        break;
      }
    }

    // If the game is over
    if (isGameOver) {
      // Stop the timer
      setIsGameActive(false);

      // Prompt the user for inputing their name
      const username = prompt('What is your username?');

      // Send a new record to database
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
            return alert(response.message);
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }, [characters]);

  const handleTargetClick = function thatPlacesTargetBoxOnPicture(event) {
    // If the target box is already shown
    if (isTargetChosen) {
      // Remove the target box on second click
      setIsTargetChosen(false);
    } else {
      // Place the target box where user clicked
      setIsTargetChosen(true);

      // Store the coordinates as relative percentages in the image
      const rect = imgRef.current.getBoundingClientRect();
      setTargetCoordinates({
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      });
      console.log(targetCoordinates);
    }
  };

  return (
    <>
      <h1 className={styles.h1}>{pictureName.toUpperCase()}</h1>
      <p className={styles.instructions}>
        Mark characters by clicking on the picture and choosing the character
        you found.
      </p>
      <Stopwatch
        isActive={isGameActive}
        milliseconds={milliseconds}
        setMilliseconds={setMilliseconds}
      />
      <div className={styles['picture-container']}>
        <img
          className={styles.picture}
          src={`/src/assets/pictures/${pictureName}.jpg`}
          alt="picture"
          onClick={handleTargetClick}
          ref={imgRef}
        />
        {isTargetChosen && (
          <TargetModal
            characters={characters.filter((character) => !character.isFound)}
            coordinates={targetCoordinates}
          />
        )}
      </div>
      <section>
        <h2 className={styles.h2}>Find these characters:</h2>
        <p className={styles['characters-instructions']}>
          ❌ means they haven't been found yet.
        </p>
        <ul className={styles['characters-list']}>
          {characters.map((character) => {
            return (
              <li>
                {character.isFound ? '✅ ' : '❌ '}
                {character.name.charAt(0).toUpperCase() +
                  character.name.slice(1)}
                <img
                  src={`/src/assets/characters/${character.name}.png`}
                  alt=""
                  className={styles['character-pic']}
                />
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h2 className={styles.h2}>Record times:</h2>
        {records.length === 0 ? (
          <p className={styles['no-records-msg']}>No records yet.</p>
        ) : (
          <ol>
            {records.map((record) => {
              return (
                <li>
                  {record.name} - {Math.floor(record.milliseconds / 60000)}m{' '}
                  {(record.milliseconds % 60000) / 1000}s
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </>
  );
}

export default PlayPage;
