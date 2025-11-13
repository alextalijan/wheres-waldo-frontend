import { useEffect, useState } from 'react';

function Stopwatch({ isActive, milliseconds, setMilliseconds }) {
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setMilliseconds((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, setMilliseconds]);

  return (
    <span>
      Time:{' '}
      {Math.floor(milliseconds / 60000) +
        'm ' +
        Math.floor((milliseconds % 60000) / 1000) +
        's'}
    </span>
  );
}

export default Stopwatch;
