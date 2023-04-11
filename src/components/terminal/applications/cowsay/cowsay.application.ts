import { IApplication } from '../IApplication';

export const CowSayApplication: IApplication = () => {
  const splitMessage = (message: string): string[] => {
    return message.match(/.{1,39}/g) || [];
  };

  const generateBubble = (message: string): string => {
    const lines = splitMessage(message);
    const length = Math.min(41, Math.max(message.length + 2, 2));
    let bubble = ` ${Array(length+1).join('_')}\n`;
    if (lines.length > 1) {
      bubble += `/${Array(length).join(' ')}\\\n`;
      lines.forEach(
        (line) =>
          (bubble += `| ${line}${Array(length - line.length).join(' ')}|\n`)
      );
      bubble += `\\${Array(length).join(' ')}/\n`;
    } else {
      bubble += `< ${lines[0]} >\n`;
    }
    bubble += ` ${Array(length+1).join('-')}`;
    return bubble;
  };

  const getCharacter = (character: string): string => {
    '        ';
    switch (character) {
      case 'cow':
        return `        \\
         \\
           ^__^
           (oo)\\_______
           (__)\\       )\\/\\
               ||----w |
               ||     ||`;
      case 'fox':
        return ` \\
  \\
   \\
    |\\_/|,,_____,~~\`
    (.".)~~     )\`~}}
     \\o/\\ /---~\\\\ ~}}
       _//    _// ~}`;
      case 'tux':
        return `     \\
      \\
       \\
        .--.
       |o_o |
       |:_/ |
      //   \\ \\
     (|     | )
    /'\\_   _/\`\\
    \\___)=(___/`
    }
    return '';
  };

  const open = (message: string, character: string = 'cow') => {
    const bubble = generateBubble(message);
    const characterText = getCharacter(character)
    return `${bubble}
${characterText}`;
  };

  return { open };
};
