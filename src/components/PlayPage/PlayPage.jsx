import { useParams } from 'react-router-dom';
import styles from './PlayPage.module.css';
import Stopwatch from '../Stopwatch/Stopwatch';
import { useEffect, useState } from 'react';

function PlayPage() {
  const { pictureName } = useParams();
  const [isGameActive, setIsGameActive] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [records, setRecords] = useState([]);

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

  return (
    <>
      <h1 className={styles.h1}>{pictureName.toUpperCase()}</h1>
      <p className={styles.instructions}>
        Mark characters by clicking on the picture and choosing the character
        you found.
      </p>
      <div className={styles['record-times']}>
        <Stopwatch isActive={isGameActive} />
        <span>Best Time:</span>
      </div>
      <img
        className={styles.picture}
        src={`/src/assets/pictures/${pictureName}.jpg`}
        alt="picture"
      />
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
