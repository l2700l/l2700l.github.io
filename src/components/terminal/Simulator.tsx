import React, { useRef, useState } from 'react';
import { Commands } from './commands';
import styles from './Simulator.module.scss';
import LineStart from './LineStart';
import { home as home } from './fileSystem';
import { logo } from './logo';
import {
  browserName,
  isBrowser,
  useDeviceData,
  useMobileOrientation,
} from 'react-device-detect';
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
nano <path> [data]
    – create file
rm [-R] <path>
    - remove file or directory
echo <data> > <path>
    – write to file
clear
    – clear outputs
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
  >(startMessage ? [{ output: startMessage, path: '~' }] : []);
  const [currentPath, setCurrentPath] = useState('~');
  const inputRef = useRef<HTMLInputElement>(null);
  const orientation = useMobileOrientation();

  const updateCommand = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommands((prevState) => {
      return [...prevState.slice(0, prevState.length - 1), e.target.value];
    });
  };

  function parsePath(
    path: string = currentPath.slice(1, currentPath.length)
  ): {} | Error {
    let parsedPath: {} = home;
    let nPath = '';
    const tokens = path.split('/').filter((token) => token !== '');
    tokens.forEach((token) => {
      if (token !== '..') {
        nPath !== ''
          ? (nPath += nPath[path.length - 1] === '/' ? token : '/' + token)
          : (nPath = token);
        console.log(nPath, parsedPath);
        if (typeof parsedPath[token as keyof typeof parsedPath] === 'object') {
          parsedPath = parsedPath[token as keyof typeof parsedPath];
        } else {
          throw new Error();
        }
      } else {
        nPath = nPath
          .split('/')
          .slice(0, nPath.split('/').length - 3)
          .join('/');
        parsedPath = parsePath(nPath);
      }
    });
    return parsedPath;
  }

  const ls = (path: string): { [key: string]: 'file' | 'dir' } | Error => {
    let parsedPath = parsePath(path);
    const keys = Object.keys(parsedPath);
    const data: { [key: string]: 'file' | 'dir' } = {};
    keys.forEach((key) => {
      // @ts-ignore
      if (typeof parsedPath[key] === 'object') {
        data[key] = 'dir';
      } else {
        data[key] = 'file';
      }
    });
    return data;
  };

  const cd = (newPath: string): string => {
    let path = currentPath.slice(1, currentPath.length);
    if (currentPath === '~' && newPath.startsWith('../')) {
      return '';
    }
    try {
      if (newPath !== '') {
        const tokens = newPath.split('/').filter((token) => token !== '');
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          console.log('token: ', token, 'path:', path);
          if (token !== '..') {
            try {
              const tree = parsePath(path + '/' + token);
              if (typeof tree === 'object') {
                path !== '' ? (path += '/' + token) : (path = token);
                setCurrentPath((prevState) => prevState + '/' + token);
              } else {
                throw new Error();
              }
            } catch (e) {
              console.log('error =(');
              throw new Error();
            }
          } else {
            path = path
              .split('/')
              .slice(0, path.split('/').length - 1)
              .join('/');
            setCurrentPath((prevState) => {
              const newState = prevState
                .split('/')
                .slice(0, prevState.split('/').length - 1)
                .join('/');
              return newState;
            });
          }
        }
      }
      return '';
    } catch (e) {
      return 'uncorrected path';
    }
  };

  const cat = (path: string): string => {
    const paths = (currentPath.slice(1, currentPath.length) + '/' + path).split(
      '/'
    );
    const tree =
      paths.length > 1
        ? parsePath(paths.slice(0, paths.length - 1).join('/'))
        : parsePath();
    if (
      tree[paths[paths.length - 1] as keyof typeof tree] &&
      typeof tree[paths[paths.length - 1] as keyof typeof tree] === 'string'
    ) {
      return tree[paths[paths.length - 1] as keyof typeof tree] as string;
    }
    return 'uncorrected or empty file';
  };

  const create = (path: string, data: any): string => {
    const paths = (currentPath.slice(1, currentPath.length) + '/' + path).split(
      '/'
    );
    const tree =
      paths.length > 1
        ? parsePath(paths.slice(0, paths.length - 1).join('/'))
        : parsePath();
    if (!tree[paths[paths.length - 1] as keyof typeof tree]) {
      // @ts-ignore
      tree[paths[paths.length - 1] as keyof typeof tree] = data;
      return '';
    } else {
      return 'uncorrected path';
    }
  };

  const rm = (path: string, recursion?: boolean) => {
    const paths = (currentPath.slice(1, currentPath.length) + '/' + path).split(
      '/'
    );
    const tree =
      paths.length > 1
        ? parsePath(paths.slice(0, paths.length - 1).join('/'))
        : parsePath();
    if (tree[paths[paths.length - 1] as keyof typeof tree]) {
      // @ts-ignore
      if (
        typeof tree[paths[paths.length - 1] as keyof typeof tree] ===
          'object' &&
        recursion
      ) {
        delete tree[paths[paths.length - 1] as keyof typeof tree];
      } else if (
        typeof tree[paths[paths.length - 1] as keyof typeof tree] ===
          'object' &&
        !recursion
      ) {
        return 'this is a directory, use the -R flag to remove directories\n';
      } else {
        delete tree[paths[paths.length - 1] as keyof typeof tree];
      }
      return '';
    } else {
      return 'uncorrected path';
    }
  };

  const echo = (path: string, data: string): string => {
    const paths = (currentPath.slice(1, currentPath.length) + '/' + path).split(
      '/'
    );
    const tree =
      paths.length > 1
        ? parsePath(paths.slice(0, paths.length - 1).join('/'))
        : parsePath();
    if (
      typeof tree[paths[paths.length - 1] as keyof typeof tree] === 'string'
    ) {
      // @ts-ignore
      tree[paths[paths.length - 1] as keyof typeof tree] = data;
      return '';
    } else {
      return 'uncorrected path';
    }
  };

  const mkdir = (path: string): string => {
    return create(path, {});
  };

  const nano = (path: string, data: string = ''): string => {
    return create(path, data);
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
      inputRef?.current?.scrollIntoView({ behavior: 'smooth' });
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
      setTimeout(
        () =>
          inputRef?.current?.scrollIntoView({
            behavior: 'smooth',
          }),
        1
      );
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
          const data = ls(
            currentPath.slice(1, currentPath.length) + '/' + (command[1] || '')
          );
          const output: Array<string> = [];
          Object.keys(data).forEach((key) => {
            output.push(key);
          });
          setOutputs((prevState) => [
            ...prevState,
            { output: output.join('    '), path: currentPath },
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
        const catOutput = cat(command.slice(1, command.length).join(' '));
        setOutputs((prevState) => [
          ...prevState,
          {
            output: catOutput,
            path: currentPath,
          },
        ]);
        break;
      case Commands.mkdir:
        const mkdirOutput = mkdir(command[1]);
        setOutputs((prevState) => [
          ...prevState,
          { output: mkdirOutput, path: currentPath },
        ]);
        break;
      case Commands.nano:
        const nanoOutput = nano(
          command[1],
          command.slice(2, command.length).join(' ') || ''
        );
        setOutputs((prevState) => [
          ...prevState,
          { output: nanoOutput, path: currentPath },
        ]);
        break;
      case Commands.echo:
        const args = command.slice(1, command.length).join(' ').split(' > ');
        if (args.length < 2) {
          setOutputs((prevState) => [
            ...prevState,
            { output: 'syntax error', path: currentPath },
          ]);
          break;
        }
        const echoOutput = echo(args[1], args[0]);
        setOutputs((prevState) => [
          ...prevState,
          { output: echoOutput, path: currentPath },
        ]);
        break;
      case Commands.rm:
        const recursion = command.length === 3 && command[1] === '-R';
        const rmPath = command.length === 3 ? command[2] : command[1];
        const rmOutput = rm(rmPath, recursion);
        setOutputs((prevState) => [
          ...prevState,
          { output: rmOutput, path: currentPath },
        ]);
        break;
      case Commands.neofetch:
        const deviceData = useDeviceData(window.navigator.userAgent);
        const neofetchOutput = logo(
          user,
          name,
          isBrowser ? 'PC' : 'Mobile',
          browserName,
          deviceData,
          orientation.orientation,
          {
            width: window.screen.width,
            height: window.screen.height,
          },
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'Dark'
            : 'Light',
          window.navigator.language,
          new Date().getTimezoneOffset()
        );
        setOutputs((prevState) => [
          ...prevState,
          { output: neofetchOutput, path: currentPath },
        ]);
        break;
      case Commands.clear:
        setOutputs([]);
    }
    setCommands((prevState) => {
      setHistoryIndex(prevState.length);
      return [...prevState, ''];
    });
    setTimeout(
      () => inputRef?.current?.scrollIntoView({ behavior: 'smooth' }),
      1
    );
  };
  return (
    <div
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
      {outputs.map((output, index) => (
        <div key={index}>
          <p className={styles.simulator__line}>
            {!startMessage ||
              (startMessage && index !== 0 && (
                <>
                  <LineStart user={user} name={name} path={output.path} />
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
        <LineStart user={user} name={name} path={currentPath} />
        <input
          ref={inputRef}
          className={styles.simulator__command}
          value={commands[commands.length - 1]}
          onChange={updateCommand}
        />
      </p>
    </div>
  );
};

export default Simulator;
