import { TermApp } from '../../../../components/terminal/interfaces/TermApp';
import { getCharacter } from './getCharacter';
import { getArgs } from '../../../../components/terminal/other/getArgs';
import { generateBubble } from './generateBubble';

export const cowsay: TermApp = {
  help: {
    template: 'cowsay <text> [--character cow|fox|tux]',
    description: 'talking cow, what?',
  },
  execute: (command, closeApp) => {
    const { argsString } = getArgs(command);
    if (!argsString) return closeApp('message not provided');

    const [message, character] = argsString.split(' --character ');

    const bubble = generateBubble(message);
    const characterText = getCharacter(character);

    return closeApp(`${bubble}
${characterText}`);
  },
};
