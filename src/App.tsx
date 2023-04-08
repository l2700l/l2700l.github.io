import React, { useState } from 'react';
import './App.css';
import styles from './App.module.scss';
import './nyan_cat.scrollbar.css';
import GreetingBlock from './blocks/greeting/Greeting.block';
import TerminalBlock from './blocks/terminal/Terminal.block';

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.app__block_wrapper}>
        <section className={styles.app__block}>
          <GreetingBlock name={'l2700l'} profession={'fullstack developer'} />
        </section>
      </div>
      <div className={styles.app__block_wrapper}>
        <section className={styles.app__block}>
          <TerminalBlock user={'l2700l'} name={'fullstack-dev'} />
        </section>
      </div>
    </div>
  );
}

export default App;
