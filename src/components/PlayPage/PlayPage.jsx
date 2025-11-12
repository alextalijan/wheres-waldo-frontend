import { useParams } from 'react-router-dom';
import styles from './PlayPage.module.css';
import Stopwatch from '../Stopwatch/Stopwatch';
import { useState } from 'react';

function PlayPage() {
  const { pictureName } = useParams();
  const [isStopwatchActive, setIsStopwatchActive] = useState(true);

  return (
    <>
      <h1 className={styles.h1}>{pictureName.toUpperCase()}</h1>
      <p className={styles.instructions}>
        Mark characters by clicking on the picture and choosing the character
        you found.
      </p>
      <div className={styles['record-times']}>
        <Stopwatch isActive={isStopwatchActive} />
        <span>Best Time:</span>
      </div>
      <img
        className={styles.picture}
        src={`/src/assets/pictures/${pictureName}.jpg`}
        alt="picture"
      />
    </>
  );
}

export default PlayPage;
