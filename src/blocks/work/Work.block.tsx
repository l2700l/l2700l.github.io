import React from 'react';
import styles from './Work.block.module.scss';

const WorkBlock: React.FC<{
  where: { name: string; url: string };
  logo: { image: string; text?: string };
}> = ({ where, logo }) => {
  return (
    <div>
      <div className={styles.work_block__work_in}>
        <h1>
          I work in{' '}
          <a href={where.url} target="_blank">
            {where.name}
          </a>{' '}
          and I don't complain 😎
        </h1>
        <img
          className={styles.work_block__img}
          title={logo.text}
          src={logo.image}
          alt="this was supposed to be the logo of my place of work, but he is shy"
        />
      </div>
      <br />
      <br />
      <h2>What are we doing? (judging by the text - nothing, but it's not)</h2>
    </div>
  );
};

export default WorkBlock;
