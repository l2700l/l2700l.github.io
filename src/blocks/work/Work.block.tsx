import React from 'react';
import styles from './Work.block.module.scss';
import Chip from '../../components/chip/Chip';

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
      <h2>What are we doing?</h2>
      <div className={styles.work_block__chips}>
        <Chip>Code cool websites</Chip>
        <Chip>Build amazing backends</Chip>
        <Chip>Drink a lot of coffee/tea</Chip>
        <Chip>Design of designs</Chip>
        <Chip>Make VK mini apps</Chip>
        <Chip>Participate in hackathons to learn something</Chip>
      </div>
      <h2>How to contact?</h2>
      <div className={styles.work_block__contacts}>
        <h4>
          <a href={where.url} target="_blank">
            VK
          </a>
        </h4>
        <h4>
          <a href={'mailto:tap_team@mail.ru'}>Email</a>
        </h4>
      </div>
    </div>
  );
};

export default WorkBlock;
