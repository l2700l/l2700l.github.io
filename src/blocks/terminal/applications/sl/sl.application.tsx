import { TermApp } from 'reterm';
import Sl from './Sl';

export const sl: TermApp = {
  help: {
    template: '*secret*',
    description: 'do not make mistakes in commands!',
  },
  execute: (command, closeApp) => {
    return <Sl closeApp={closeApp} />;
  },
};
