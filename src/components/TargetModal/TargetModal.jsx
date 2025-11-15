import styles from './TargetModal.module.css';
import { useState } from 'react';

function TargetModal({ characters, coordinates }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const coordinateStyles = {
    left: coordinates.x - 10,
    top: coordinates.y - 10,
  };

  // If modal is too far right
  if (coordinates.x > 300) {
    // Set the modal to be on the left side
    coordinateStyles.flexDirection = 'row-reverse';
    coordinateStyles.left -= 305;
  }

  return (
    <div className={styles.target} style={coordinateStyles}>
      <div className={styles['target-box']}></div>
      <div className={styles['target-modal']}>
        <span className={styles['target-heading']}>Who did you find?</span>
        <div>
          {characters.map((character) => {
            return (
              <label key={character.name}>
                <input
                  type="radio"
                  name="characters"
                  value={character.name}
                  checked={selectedOption === character.name}
                  onChange={handleOptionChange}
                />
                {character.name.charAt(0).toUpperCase() +
                  character.name.slice(1)}
              </label>
            );
          })}
        </div>
        <button type="button" className={styles['choose-target-btn']}>
          Choose
        </button>
      </div>
    </div>
  );
}

export default TargetModal;
