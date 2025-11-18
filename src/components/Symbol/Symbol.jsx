import styles from './Symbol.module.css';

function Symbol({ symbol, disappear }) {
  return (
    <span className={styles.symbol} onAnimationEnd={disappear}>
      {symbol}
    </span>
  );
}

export default Symbol;
