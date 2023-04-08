import React, { useState } from 'react';
import './App.css';
import styles from './App.module.scss';
import './nyan_cat.scrollbar.css';
import GreetingBlock from './blocks/greeting/Greeting.block';
import TerminalBlock from './blocks/terminal/Terminal.block';
import WorkBlock from './blocks/work/Work.block';
import ttlogo from './images/ttlogo.jpeg';
import EndBlock from './blocks/end/End.block';

const konamiCode = JSON.stringify([
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'a',
  'b',
]);

function App() {
  const [, setKeys] = useState<Array<string>>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const handleKeys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    setKeys((prevState) => {
      const newState =
        prevState.length < 10
          ? [...prevState, e.key]
          : [...prevState.slice(1, prevState.length), e.key];
      if (JSON.stringify(newState) === konamiCode) {
        setShowTerminal(true);
        alert('check second block 0_o');
      }
      return newState;
    });
  };
  return (
    <div
      onKeyDown={(e) => !showTerminal && handleKeys(e)}
      tabIndex={showTerminal ? undefined : 0}
      className={styles.app}
    >
      <div className={styles.app__block_wrapper}>
        <section className={styles.app__block}>
          <GreetingBlock name={'l2700l'} profession={'fullstack developer'} />
        </section>
      </div>
      {showTerminal && (
        <div className={styles.app__block_wrapper}>
          <section className={styles.app__block}>
            <TerminalBlock user={'l2700l'} name={'fullstack-dev'} />
          </section>
        </div>
      )}
      <div className={styles.app__block_wrapper}>
        <section className={styles.app__block}>
          <WorkBlock
            where={{ name: 'Tap Team', url: 'https://vk.com/tap_team_studio' }}
            logo={{ image: ttlogo, text: 'tap - tap' }}
          />
        </section>
      </div>
      <div className={styles.app__block_wrapper}>
        <section className={styles.app__block}>
          <EndBlock />
        </section>
      </div>
    </div>
  );
}

export default App;
