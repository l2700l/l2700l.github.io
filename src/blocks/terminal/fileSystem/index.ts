import { animeImage, mp3playerImage, programmerImage } from './images';
import { forMoneyYes } from './trash';

export const home: object = {
  'why.txt': 'I was bored =)',
  Desktop: {
    trash: {
      'for money yes': forMoneyYes,
    },
    skills: {
      frontend: {
        '<HTML|CSS>': 'position: absolute !important; =)',
        'JS|TS.{j|t}s': `compiling ts to js...
... done!

// @ts-ignore
code`,
        'React.js': "import React from 'react' – why?",
      },
      backend: {
        'python.py': `import pentagon
pentagon.hack()`,
        'nest.js': `Me: Oh no, that's circular dependency!
Forwardref: hold my beer`,
        'docker.sock': `docker-compose down – ❌
docker restart – ✅`,
        'postgresql.sql': 'DROP TABLE Users;',
        'redis.rdb': 'More caching for the caching god',
      },
      other: {
        'Figma.fig': "Designers don't know how to design",
        'PhotoShop.psd': 'Funny kids slicing',
        '.git':
          "My life has either been added to .gitignore or it's make commits to an abandoned repository =(",
        'YouGile.txt':
          'It is an alternative to Trello and other agile development tools.',
      },
    },
    hobbies: {
      'anime.txt': 'I have over 700 titles viewed, any questions?',
      'video games.txt':
        'I would play games if I had the desire and time, but one of the above is always missing',
    },
  },
  images: {
    'programmer.png': programmerImage,
    'mp3player.png': mp3playerImage,
    'anime.png': animeImage,
  },
};
