import { useState, useEffect } from 'react';
import styles from './PictureSelection.module.css';
import { Link } from 'react-router-dom';

function PictureSelection({ name }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(`/src/assets/pictures/${name}_gray.jpg`);

  useEffect(() => {
    // If the picture is hovered on, set it to color
    if (isHovered) {
      setImgSrc(`/src/assets/pictures/${name}.jpg`);
    } else {
      setImgSrc(`/src/assets/pictures/${name}_gray.jpg`);
    }
  }, [isHovered, name]);

  return (
    <Link className={styles.card} to={`/play/${name}`}>
      <div
        className={styles.picture}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img className={styles['picture-img']} src={imgSrc} alt="" />
      </div>
      <span className={styles['picture-name']}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </span>
    </Link>
  );
}

export default PictureSelection;
