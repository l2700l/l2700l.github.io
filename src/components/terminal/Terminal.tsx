import React, { useEffect, useState } from 'react';
import styles from './Terminal.module.scss';
import Simulator from './Simulator';
const Terminal: React.FC<{
  user?: string;
  name?: string;
  startMessage?: string;
}> = ({ user = 'user', name = 'computer', startMessage }) => {
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );
  const handleResize = () => {
    if (window.innerWidth > window.innerHeight) {
      setOrientation('landscape');
    } else {
      setOrientation('portrait');
    }
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      {orientation === 'landscape' ? (
        <div className={styles.terminal}>
          <div className={styles.terminal__top}>
            <div>
              <svg width="60" height="15">
                <circle
                  cx="15"
                  cy="7"
                  r="6"
                  style={{ fill: 'rgb(230,106,103)' }}
                />
                <circle
                  cx="30"
                  cy="7"
                  r="6"
                  style={{ fill: 'rgb(233,214,137)' }}
                />
                <circle
                  cx="45"
                  cy="7"
                  r="6"
                  style={{ fill: 'rgb(184,227,139)' }}
                />
              </svg>
            </div>
            <div className={styles.terminal__header}>
              {user}@{name}
            </div>
          </div>
          <Simulator
            name={name}
            user={user}
            borderRadius={{ bottomLeft: '0.5rem', bottomRight: '0.5rem' }}
            startMessage={startMessage}
          />
        </div>
      ) : (
        <h2 style={{ textAlign: 'center' }}>
          Use <i>landscape</i> orientation!
        </h2>
      )}
    </>
  );
};

export default Terminal;
