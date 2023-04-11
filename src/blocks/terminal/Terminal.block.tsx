import React from 'react';
import styles from './Terminal.block.module.scss';
import { Terminal } from '../../components/terminal';
import { home } from './fileSystem';

const startMessage = `
    ██╗     ██████╗ ███████╗ ██████╗  ██████╗ ██╗
    ██║     ╚════██╗╚════██║██╔═████╗██╔═████╗██║
    ██║      █████╔╝    ██╔╝██║██╔██║██║██╔██║██║
    ██║     ██╔═══╝    ██╔╝ ████╔╝██║████╔╝██║██║
    ███████╗███████╗   ██║  ╚██████╔╝╚██████╔╝███████╗
    ╚══════╝╚══════╝   ╚═╝   ╚═════╝  ╚═════╝ ╚══════╝
    
████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
   
`;

const TerminalBlock: React.FC<{ user: string; name: string }> = ({
  user,
  name,
}) => {
  return (
    <>
      <h3 className={styles.terminal_block__title}>
        If you are interested in{' '}
        <span className={styles.terminal_block__title_me}>me</span>, then you
        can learn more about me through this{' '}
        <span className={styles.terminal_block__title_terminal}>
          interactive terminal
        </span>
        .
      </h3>
      <div style={{ width: '100%', height: '80%' }}>
        <Terminal
          fs={home}
          startMessage={startMessage}
          user={user}
          name={name}
        />
      </div>
    </>
  );
};

export default TerminalBlock;
