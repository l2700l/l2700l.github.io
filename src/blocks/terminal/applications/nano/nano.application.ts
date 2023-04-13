import { TermApp } from '../../../../components/terminal/interfaces/TermApp';
import Nano from './Nano';
import { FS } from '../../../../components/terminal/fs/fs';
import { getArgs } from '../../../../components/terminal/other/getArgs';

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
    return Nano({ closeApp, prevData, path });
  },
};
