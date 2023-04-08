import React from 'react';
import styles from './End.block.module.scss';
import Social from '../../components/social/Social';

const EndBlock = () => {
  return (
    <div className={styles.end_block}>
      <div className={styles.end_block_center}>
        <h1>End!</h1>
        <h2>thank you for your attention</h2>
        <br />
        <Social
          brands={[
            { name: 'vk', url: 'https://vk.com/l2700l' },
            { name: 'github', url: 'https://github.com/l2700l' },
            {
              name: 'discord',
              url: 'https://discordapp.com/users/495256645308514328',
            },
            {
              name: 'telegram',
              url: 'https://t.me/I2700I',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default EndBlock;
