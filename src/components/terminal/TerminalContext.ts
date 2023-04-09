import { createContext } from 'react';

export const TerminalContext = createContext<
  { [key: string]: any } & { closeApp: (output?: string) => void }
>({
  closeApp: (output?: string) => {
    throw new Error('closeApp function not defined');
  },
});
