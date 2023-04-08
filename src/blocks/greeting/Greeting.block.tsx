import React, { useRef, useState } from 'react';
import styles from './Greeting.block.module.scss';

const initialText = `Perhaps there would be some text here, but I'm too lazy to come up with something.`;
const easterEggText = `↑ ↑ ↓ ↓ ← → ← → A B`;

const GreetingBlock: React.FC<{ name: string; profession: string }> = ({
  name,
  profession,
}) => {
  const [text, setText] = useState(initialText);
  const textRef = useRef<HTMLParagraphElement>(null);
  const changeText = () => {
    if (text === initialText) {
      if (textRef.current?.className !== undefined) {
        textRef.current.className = styles.greeting_block_fade_reverse;
      }
      setTimeout(() => {
        setText(easterEggText);
        if (textRef.current?.className !== undefined) {
          textRef.current.className = styles.greeting_block_fade_forwards;
        }
      }, 750);
    }
  };
  return (
    <div className={styles.greeting_block}>
      <h1 className={styles.greeting_block__name}>
        Hi i'm <span>{name}</span>!
      </h1>
      <h3
        className={[
          styles.greeting_block__profession,
          styles.greeting_block_typing,
        ].join('')}
        style={{ '--i': '2.5s' } as React.CSSProperties}
      >
        I <span>{profession}</span>.
      </h3>
      <br />

      <p className={styles.greeting_block_fill}>
        The site is a compilation of some of my skills and unfunny jokes =)
        <br />
        But! The site is not finished yet, we need to come up with even more
        jokes.
      </p>
      <br />
      <p
        className={styles.greeting_block_fade_forwards}
        ref={textRef}
        title={
          text === initialText
            ? undefined
            : 'I really broke to make this code work, maybe in the future it will work…'
        }
        style={
          {
            '--i': '1.5s',
            cursor: text === initialText ? 'pointer' : 'default',
          } as React.CSSProperties
        }
        onClick={changeText}
      >
        <b>{text}</b>
      </p>
    </div>
  );
};

export default GreetingBlock;
