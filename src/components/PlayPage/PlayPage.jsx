import { useParams } from 'react-router-dom';
import styles from './PlayPage.module.css';
import Stopwatch from '../Stopwatch/Stopwatch';
import TargetModal from '../TargetModal/TargetModal';
import Marker from '../Marker/Marker';
import Symbol from '../Symbol/Symbol';
import { useEffect, useState, useRef } from 'react';

function PlayPage() {
  const { pictureName } = useParams();
  const [isGameActive, setIsGameActive] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [records, setRecords] = useState([]);
  const [milliseconds, setMilliseconds] = useState(0);
  const [isTargetChosen, setIsTargetChosen] = useState(false);
  const [targetCoordinates, setTargetCoordinates] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [symbol, setSymbol] = useState(null);
  const [refreshRecords, setRefreshRecords] = useState(false);
  const imgRef = useRef(null);
  const recordsRef = useRef(null);

  // Fetch the characters to be found on this page
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `pictures/${pictureName}/appearances`)
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          return alert('Fetching characters error.');
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
        if (!response.success) {
          return alert('Fetching records error.');
        }

        setRecords(response.records);
      });
  }, [pictureName, refreshRecords]);

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
            return alert('Error posting the record.');
          }

          // Fetch the records again and scroll to it
          setRefreshRecords((prev) => !prev);
          recordsRef.current.scrollIntoView({
            behavior: 'smooth',
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }, [characters, pictureName]);

  const handleTargetClick = function thatPlacesTargetBoxOnPicture(event) {
    // If the target box is already shown
    if (isTargetChosen) {
      // Remove the target box on second click
      setIsTargetChosen(false);
    } else if (isGameActive) {
      // Place the target box where user clicked
      setIsTargetChosen(true);

      // Store the coordinates as relative percentages in the image
      const rect = imgRef.current.getBoundingClientRect();
      setTargetCoordinates({
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      });
    }
  };

  function handleCharacterGuess(choice) {
    // If the character they have found does not exist
    if (!characters.map((character) => character.name).includes(choice)) {
      // Alert them they are target an unexisting character
      alert(`Character named ${choice} does not exist.`);
      return;
    }

    // Find the character they claim to have found
    for (const character of characters) {
      if (character.name === choice) {
        // If the character is at the place they pointed at
        if (
          targetCoordinates.x > character.xCoordinate - 0.01 &&
          targetCoordinates.x < character.xCoordinate + 0.01 &&
          targetCoordinates.y > character.yCoordinate - 0.01 &&
          targetCoordinates.y < character.yCoordinate + 0.01
        ) {
          // Mark the character as found
          setCharacters([
            ...characters.filter((character) => character.name !== choice),
            { ...character, isFound: true },
          ]);

          // Circle the character on the picture
          setMarkers([...markers, { ...targetCoordinates }]);

          // Announce the guess was right
          setSymbol('✅');
        } else {
          // Announce the guess was wrong
          setSymbol('❌');
        }

        // Remove the target modal
        setIsTargetChosen(false);
        break;
      }
    }
  }

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
            handleGuess={handleCharacterGuess}
          />
        )}
        {markers.map((marker) => {
          return <Marker coordinates={{ ...marker }} />;
        })}
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
      <section
        className={
          isGameActive
            ? styles['records-section']
            : `${styles['records-section']} ${styles['flash-animation']}`
        }
        ref={recordsRef}
      >
        <h2 className={styles.h2}>Record times:</h2>
        {records.length === 0 ? (
          <p className={styles['no-records-msg']}>No records yet.</p>
        ) : (
          <ol className={styles['records-list']}>
            {records.map((record) => {
              return (
                <li className={styles.record}>
                  <span>{record.name}</span>
                  <span className={styles['record-divider']}> - </span>
                  <span>
                    {Math.floor(record.milliseconds / 60000)}m{' '}
                    {(record.milliseconds % 60000) / 1000}s
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </section>
      {symbol && <Symbol symbol={symbol} disappear={() => setSymbol(null)} />}
    </>
  );
}

export default PlayPage;
