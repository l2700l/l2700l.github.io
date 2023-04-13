import React from 'react';
import styles from './Social.module.scss';

const Social: React.FC<{ brands?: { name: string; url: string }[] }> = ({
  brands = [],
}) => {
  return (
    <ul className={styles.social}>
      {brands.map((brand) => (
        <li key={brand.name}>
          <a className={brand.name} href={brand.url} target="_blank">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <i className={`fa-brands fa-${brand.name}`} aria-hidden="true"></i>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Social;
