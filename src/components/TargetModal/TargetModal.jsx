import styles from './TargetModal.module.css';
import { useState } from 'react';

function TargetModal({ characters, coordinates }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const coordinateStyles = {
    top: `calc(${coordinates.y * 100}% - 10px)`,
  };

  // If modal is too far right
  if (coordinates.x > 0.25) {
    // Set the modal to be on the left side
    coordinateStyles.flexDirection = 'row-reverse';
    coordinateStyles.right = `calc(100% - ${coordinates.x * 100}% - 10px)`;
  } else {
    // Set it normally
    coordinateStyles.left = `calc(${coordinates.x * 100}% - 10px)`;
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
