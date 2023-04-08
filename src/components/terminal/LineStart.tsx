import React from 'react';
import styles from './Simulator.module.scss';

const LineStart: React.FC<{ user: string; name: string; path: string }> = ({
  user,
  name,
  path,
}) => {
  return (
    <span>
      <span className={styles.simulator__user}>{user}</span>
      <span className={styles.simulator__at}>@</span>
      <span className={styles.simulator__computer}>{name}</span>
      <span>:</span> <span className={styles.simulator__path}>{path}</span>{' '}
      <span>$</span>{' '}
    </span>
  );
};

export default LineStart;
