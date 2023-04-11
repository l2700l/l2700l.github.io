import { createContext, useContext } from 'react';

const terminalContext = createContext<
  (Record<string, any | null> & { closeApp: (output?: string) => void }) | null
>(null);
export const TerminalProvider = terminalContext.Provider;

export const useTerminalContext = () => {
  const data = useContext(terminalContext);
  if (!data)
    throw new Error(
      'Can not use "useTerminalContext" outside of the "TerminalProvider"'
    );
  return data;
};
