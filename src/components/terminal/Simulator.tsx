import React, { useRef, useState } from 'react';
import { Commands } from './commands';
import styles from './Simulator.module.scss';
import LineStart from './LineStart';
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
}> = ({ user = 'user', name = 'computer', borderRadius, startMessage }) => {
  const [commands, setCommands] = useState<Array<string>>([]);
  const [, setHistoryIndex] = useState(0);
  const [outputs, setOutputs] = useState<
    Array<{ output: string; path: string }>
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

  const updateCommand = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommands((prevState) => {
      return [...prevState.slice(0, prevState.length - 1), e.target.value];
    });
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

  const execute = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp') {
      setHistoryIndex((prevState) => {
        const state = prevState > 1 ? prevState - 1 : 0;
        setCommands((prevState) => {
          return [...prevState.slice(0, prevState.length - 1), commands[state]];
        });
        return state;
      });
    }
    if (e.key === 'ArrowDown') {
      setHistoryIndex((prevState) => {
        const state =
          prevState > commands.length - 1 ? commands.length - 1 : prevState + 1;
        setCommands((prevState) => {
          return [...prevState.slice(0, prevState.length - 1), commands[state]];
        });
        return state;
      });
    }
    if (e.key !== 'Enter') {
      return;
    }
    const command = commands[commands.length - 1].split(' ');

    if (!Object.keys(Commands).includes(command[0].toLowerCase())) {
      setOutputs((prevState) => [
        ...prevState,
        { output: 'command not found: ' + command[0], path: currentPath },
      ]);
      setCommands((prevState) => {
        setHistoryIndex(prevState.length);
        return [...prevState, ''];
      });
      setTimeout(() => scrollToBottom(), 1);
      return;
    }
    switch (Commands[command[0].toLowerCase() as keyof typeof Commands]) {
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
        const path = command[1];
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
            currentPath + '/' + command.slice(1, command.length).join(' ')
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
          currentPath + '/' + command.slice(1, command.length).join(' ')
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
        FS.write(currentPath + '/' + command[1], {});
        setOutputs((prevState) => [
          ...prevState,
          { output: '', path: currentPath },
        ]);
        break;
      case Commands.nano:
        let prevData: string = '';
        try {
          prevData = FS.readFile(
            currentPath + '/' + command.slice(1, command.length).join(' ')
          );
        } catch (e) {}
        let prevPath =
          command.length > 1
            ? currentPath + '/' + command.slice(1, command.length).join(' ')
            : undefined;
        setValue({
          path: prevPath,
          prevData: prevData !== 'Uncorrected path' ? prevData : '',
        });
        setCurrentApp(Applications.nano);
        break;
      case Commands.cp:
        const args = command.slice(1).join(' ').split("'");
        const cpFile = FS.readFile(currentPath + '/' + args[1]);
        FS.write(args[3], cpFile);
        break;
      case Commands.echo:
        setOutputs((prevState) => [
          ...prevState,
          {
            output: command.slice(1, command.length).join(' '),
            path: currentPath,
          },
        ]);
        break;
      case Commands.rm:
        const recursion = command.length === 3 && command[1] === '-R';
        const rmPath = command.length === 3 ? command[2] : command[1];
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
        setOutputs((prevState) => [
          ...prevState,
          { output: '', path: currentPath },
        ]);
        break;
      case Commands.rev:
        setOutputs((prevState) => [
          ...prevState,
          {
            output: command
              .slice(1, command.length)
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
    }
    setCommands((prevState) => {
      setHistoryIndex(prevState.length);
      return [...prevState, ''];
    });
    setTimeout(() => scrollToBottom(), 1);
  };

  return (
    <div
      ref={divRef}
      className={styles.simulator}
      style={{
        borderTopLeftRadius: borderRadius?.topLeft ? borderRadius?.topLeft : 0,
        borderTopRightRadius: borderRadius?.topRight
          ? borderRadius?.topRight
          : 0,
        borderBottomLeftRadius: borderRadius?.bottomLeft
          ? borderRadius?.bottomLeft
          : 0,
        borderBottomRightRadius: borderRadius?.bottomRight
          ? borderRadius?.bottomRight
          : 0,
      }}
      onKeyDownCapture={execute}
      onClick={() => {
        inputRef?.current?.focus();
      }}
    >
      <TerminalContext.Provider value={{ ...value, closeApp, currentApp }}>
        <AppsProvider closeApp={closeApp} currentApp={currentApp} value={value}>
          {outputs.map((output, index) => (
            <div key={index}>
              <p className={styles.simulator__line}>
                {!startMessage ||
                  (startMessage && index !== 0 && (
                    <>
                      <LineStart
                        user={user}
                        name={name}
                        path={
                          output.path.startsWith(homePath)
                            ? cutHomePath(output.path)
                            : output.path
                        }
                      />
                      <span className={styles.simulator__command}>
                        {commands[startMessage ? index - 1 : index]}
                      </span>
                    </>
                  ))}
              </p>
              <p
                className={styles.simulator__line}
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
              >
                {output.output}
              </p>
            </div>
          ))}
          <p className={styles.simulator__line}>
            <LineStart
              user={user}
              name={name}
              path={
                currentPath.startsWith(homePath)
                  ? cutHomePath(currentPath)
                  : currentPath
              }
            />
            <input
              ref={inputRef}
              className={styles.simulator__command}
              value={commands[commands.length - 1]}
              onChange={updateCommand}
            />
          </p>
        </AppsProvider>
      </TerminalContext.Provider>
    </div>
  );
};

export default Simulator;
