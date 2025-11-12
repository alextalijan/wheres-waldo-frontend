import { useState, useEffect } from 'react';
import getPictureUrl from '../../utils/getPictureUrl';
import styles from './PictureSelection.module.css';

function PictureSelection({ name }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(getPictureUrl(name + '_gray'));

  return (
    <div className={styles.card}>
      <div className={styles.picture}>
        <img className={styles['picture-img']} src={imgSrc} alt="" />
      </div>
      <span className={styles['picture-name']}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </span>
    </div>
  );
}

export default PictureSelection;
