import { FS, getArgs, TermApp } from 'reterm';
import Nano from './Nano';

export const nano: TermApp = {
  help: {
    template: 'nano [path]',
    description: 'write to file',
  },
  execute: (command, closeApp, value) => {
    const { argsString } = getArgs(command);
    let prevData = FS.readFile(value.path + '/' + argsString);
    if (prevData === 'Uncorrected path') prevData = '';
    let path = argsString ? value.path + '/' + argsString : undefined;
    return <Nano closeApp={closeApp} prevData={prevData} path={path}/>
  }
};
