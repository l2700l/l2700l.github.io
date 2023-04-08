import React from 'react';
import styles from './Chip.module.scss';

const Chip: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  return <div className={styles.chip}>{children}</div>;
};

export default Chip;
