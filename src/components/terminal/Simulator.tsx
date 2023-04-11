import React, { ReactNode, useRef, useState } from 'react';
import { Commands } from './commands';
import styles from './Simulator.module.scss';
import {
  browserName,
  isBrowser,
  useDeviceData,
  useMobileOrientation,
} from 'react-device-detect';
import { FS } from './fs';
import { home } from './fileSystem';
import AppsProvider from './AppsProvider';
import { Applications } from './applications/applicationsEnum';
import { TerminalContext } from './TerminalContext';
import Output from './lines/Output';
import Input from './lines/Input';

FS.import(home);

const help = `command <required> [optional]

usage:

ls [path]
    – show files and directories
cd <path>
    – change directory
cat <path to file>
    – read file
whoiam
    – show user
mkdir <path>
    – create directory
rm [-R] <path>
    - remove file or directory
cp <'path from'> <'path to'>
    - copy file
echo <data>
    – write to output
clear
    – clear outputs & commands
rev
    - expand string
    
programs:

neofetch
    - system information tool
nano [path]
    – write to file
cowsay <text> [--character cow|fox|tux]
    - talking cow, what?
*secret*
    - do not make mistakes in commands!
`;

const Simulator: React.FC<{
  user?: string;
  name?: string;
  borderRadius?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
  startMessage?: string;
  prompt?: string;
  theme?: {
    simulatorBackground?: string;
    computerTextColor?: string;
    atTextColor?: string;
    pathTextColor?: string;
    outputTextColor?: string;
    userTextColor?: string;
    commandTextColor?: string;
  };
}> = ({
  user = 'user',
  name = 'computer',
  prompt = '$',
  borderRadius,
  startMessage,
  theme = {
    simulatorBackground: '#282A34',
    computerTextColor: '#5FBDAD',
    atTextColor: '#75C6D0',
    pathTextColor: '#FF479C',
    outputTextColor: '#FFFFFF',
    userTextColor: '#A380DA',
    commandTextColor: '#7CC9DC',
  },
}) => {
  const [commands, setCommands] = useState<Array<string>>([]);
  const [updatedCommand, setUpdatedCommand] = useState<string | undefined>();
  const [, setHistoryIndex] = useState(0);
  const [outputs, setOutputs] = useState<
    Array<{ output: ReactNode; path: string }>
  >(startMessage ? [{ output: startMessage, path: FS.getHome() }] : []);
  const [currentApp, setCurrentApp] = useState<Applications | undefined>();
  const [homePath] = useState(FS.getHome());
  const [currentPath, setCurrentPath] = useState(FS.getHome());
  const [value, setValue] = useState<{ [key: string]: any }>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const orientation = useMobileOrientation();

  const closeApp = (output?: string) => {
    if (output) {
      setOutputs((prevState) => [...prevState, { output, path: currentPath }]);
    }
    setCurrentApp(undefined);
  };

  const cutHomePath = (path: string) => {
    if (path.slice(homePath.length).length > 0) {
      return '~/' + path.slice(homePath.length);
    } else {
      return '~';
    }
  };

  const scrollToBottom = () => {
    if (divRef?.current !== undefined) {
      divRef!.current!.scrollTop = divRef?.current?.scrollHeight || 0;
    }
  };

  const cd = (newPath: string): string => {
    if (currentPath === '' && newPath.startsWith('../')) {
      return '';
    }
    try {
      if (newPath !== '') {
        setCurrentPath((prevState) =>
          FS._parsePath(prevState + '/' + newPath).join('/')
        );
      }
      return '';
    } catch (e) {
      return 'uncorrected path';
    }
  };

  const handleHistory = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp') {
      setHistoryIndex((prevState) => {
        const state = prevState > 1 ? prevState - 1 : 0;
        setUpdatedCommand(commands[state]);
        return state;
      });
    }
    if (e.key === 'ArrowDown') {
      setHistoryIndex((prevState) => {
        const state =
          prevState >= commands.length - 1
            ? commands.length - 1
            : prevState + 1;
        setUpdatedCommand(commands[state]);
        return state;
      });
    }
  };

  const execute = (command: string) => {
    const commandArray = command.split(' ');
    if (!Object.keys(Commands).includes(commandArray[0].toLowerCase())) {
      setOutputs((prevState) => [
        ...prevState,
        { output: 'command not found: ' + commandArray[0], path: currentPath },
      ]);
      setCommands((prevState) => {
        setHistoryIndex(prevState.length + 1);
        return [...prevState, commandArray[0]];
      });
      setUpdatedCommand(undefined);
      setTimeout(() => scrollToBottom(), 1);
      return;
    }
    switch (Commands[commandArray[0].toLowerCase() as keyof typeof Commands]) {
      case Commands.empty:
        setOutputs((prevState) => [
          ...prevState,
          { output: '', path: currentPath },
        ]);
        break;
      case Commands.help:
        setOutputs((prevState) => [
          ...prevState,
          { output: help, path: currentPath },
        ]);
        break;
      case Commands.cd:
        const path = commandArray[1];
        if (!path) {
          setOutputs((prevState) => [
            ...prevState,
            { output: '', path: currentPath },
          ]);
          break;
        }
        const info = cd(path);
        setOutputs((prevState) => [
          ...prevState,
          { output: info, path: currentPath },
        ]);
        break;
      case Commands.ls:
        try {
          const data = FS.getFolder(
            currentPath +
              '/' +
              commandArray.slice(1, commandArray.length).join(' ')
          );
          const lsOutput: Array<string> = [];
          Object.keys(data).forEach((key) => {
            lsOutput.push(key);
          });
          setOutputs((prevState) => [
            ...prevState,
            { output: lsOutput.join('    '), path: currentPath },
          ]);
        } catch (e) {
          setOutputs((prevState) => [
            ...prevState,
            { output: 'uncorrected path', path: currentPath },
          ]);
        }
        break;
      case Commands.whoami:
        setOutputs((prevState) => [
          ...prevState,
          { output: user, path: currentPath },
        ]);
        break;
      case Commands.cat:
        const catOutput = FS.readFile(
          currentPath +
            '/' +
            commandArray.slice(1, commandArray.length).join(' ')
        );
        setOutputs((prevState) => [
          ...prevState,
          {
            output: catOutput,
            path: currentPath,
          },
        ]);
        break;
      case Commands.mkdir:
        FS.write(currentPath + '/' + commandArray[1], {});
        setOutputs((prevState) => [
          ...prevState,
          { output: '', path: currentPath },
        ]);
        break;
      case Commands.nano:
        let prevData: string = '';
        try {
          prevData = FS.readFile(
            currentPath +
              '/' +
              commandArray.slice(1, commandArray.length).join(' ')
          );
        } catch (e) {}
        let prevPath =
          commandArray.length > 1
            ? currentPath +
              '/' +
              commandArray.slice(1, commandArray.length).join(' ')
            : undefined;
        setValue({
          path: prevPath,
          prevData: prevData !== 'Uncorrected path' ? prevData : '',
        });
        setCurrentApp(Applications.nano);
        break;
      case Commands.cp:
        const args = commandArray.slice(1).join(' ').split("'");
        const cpFile = FS.readFile(currentPath + '/' + args[1]);
        FS.write(args[3], cpFile);
        break;
      case Commands.echo:
        setOutputs((prevState) => [
          ...prevState,
          {
            output: commandArray.slice(1, commandArray.length).join(' '),
            path: currentPath,
          },
        ]);
        break;
      case Commands.rm:
        const recursion = commandArray.length === 3 && commandArray[1] === '-R';
        const rmPath =
          commandArray.length === 3 ? commandArray[2] : commandArray[1];
        const rmOutput = FS.remove(currentPath + '/' + rmPath, recursion);
        setOutputs((prevState) => [
          ...prevState,
          { output: rmOutput || '', path: currentPath },
        ]);
        break;
      case Commands.neofetch:
        const deviceData = useDeviceData(window.navigator.userAgent);
        setValue({
          user,
          name,
          isBrowser: isBrowser ? 'PC' : 'Mobile',
          browserName,
          deviceData,
          orientation: orientation.orientation,
          resolution: {
            width: window.screen.width,
            height: window.screen.height,
          },
        });
        setCurrentApp(Applications.neofetch);
        break;
      case Commands.sl:
        setCurrentApp(Applications.sl);
        break;
      case Commands.cowsay:
        const cowsayArgs = commandArray
          .slice(1)
          .join(' ')
          .split(' --character ');
        if (cowsayArgs[0] !== '') {
          setValue({ message: cowsayArgs[0], character: cowsayArgs[1] });
          setCurrentApp(Applications.cowsay);
          setCommands((prevState) => {
            setHistoryIndex(prevState.length + 1);
            return [
              ...prevState,
              commandArray[0] + ' ' + cowsayArgs.join(' --character '),
            ];
          });
          setUpdatedCommand(undefined);
          setTimeout(() => scrollToBottom(), 1);
          return;
        } else {
          setOutputs((prevState) => [
            ...prevState,
            { output: 'message not provided', path: currentPath },
          ]);
        }
        break;
      case Commands.rev:
        setOutputs((prevState) => [
          ...prevState,
          {
            output: commandArray
              .slice(1, commandArray.length)
              .join(' ')
              .split('')
              .reverse()
              .join(''),
            path: currentPath,
          },
        ]);
        break;
      case Commands.clear:
        setCommands([]);
        setOutputs(
          startMessage ? [{ output: startMessage, path: FS.getHome() }] : []
        );
        setHistoryIndex(0);
        break;
    }
    setCommands((prevState) => {
      setHistoryIndex(prevState.length + 1);
      return [...prevState, commandArray[0]];
    });
    setUpdatedCommand(undefined);
    setTimeout(() => scrollToBottom(), 1);
  };

  return (
    <div
      ref={divRef}
      className={styles.simulator}
      style={
        {
          borderTopLeftRadius: borderRadius?.topLeft
            ? borderRadius?.topLeft
            : 0,
          borderTopRightRadius: borderRadius?.topRight
            ? borderRadius?.topRight
            : 0,
          borderBottomLeftRadius: borderRadius?.bottomLeft
            ? borderRadius?.bottomLeft
            : 0,
          borderBottomRightRadius: borderRadius?.bottomRight
            ? borderRadius?.bottomRight
            : 0,
          '--simulatorBackground': theme.simulatorBackground,
          '--computerTextColor': theme.computerTextColor,
          '--atTextColor': theme.atTextColor,
          '--pathTextColor': theme.pathTextColor,
          '--outputTextColor': theme.outputTextColor,
          '--userTextColor': theme.userTextColor,
          '--commandTextColor': theme.commandTextColor,
        } as React.CSSProperties
      }
      onKeyDownCapture={handleHistory}
      onClick={() => {
        inputRef?.current?.focus();
      }}
    >
      <TerminalContext.Provider value={{ ...value, closeApp, currentApp }}>
        <AppsProvider closeApp={closeApp} currentApp={currentApp} value={value}>
          {outputs.map((output, index) => (
            <Output
              key={index}
              user={user}
              name={name}
              path={
                output.path.startsWith(homePath)
                  ? cutHomePath(output.path)
                  : output.path
              }
              lineStart={!startMessage || index !== 0}
              command={startMessage ? commands[index - 1] : commands[index]}
              prompt={prompt}
            >
              {output.output}
            </Output>
          ))}
          <div>
            <Input
              user={user}
              name={name}
              ref={inputRef}
              path={
                currentPath.startsWith(homePath)
                  ? cutHomePath(currentPath)
                  : currentPath
              }
              execute={execute}
              updatedCommand={updatedCommand}
              prompt={prompt}
            />
          </div>
        </AppsProvider>
      </TerminalContext.Provider>
    </div>
  );
};

export default Simulator;
