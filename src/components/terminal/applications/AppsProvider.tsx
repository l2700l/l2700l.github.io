import React, { ReactNode } from 'react';
import { Applications } from './applicationsEnum';
import { SlApplication } from './sl/sl.application';
import { NanoApplication } from './nano/nano.application';
import { CowSayApplication } from './cowsay/cowsay.application';
import { device, TermApp } from '../interfaces/TermApp';
import { neofetch } from '../../../blocks/terminal/fileSystem/apps';

const AppsProvider: React.FC<{
  value: { [key: string]: any };
  currentApp: Applications | undefined;
  closeApp: (output?: ReactNode) => void;
  children: ReactNode | undefined;
  valuee: { user: string; name: string; path: string; device: device };
  applications?: Record<string, TermApp>;
}> = ({ value, children, currentApp, closeApp, valuee }) => {
  const switchApp = () => {
    if (currentApp === undefined) return children;
    switch (currentApp) {
      case Applications.nano:
        // TODO: realize nano app
        return NanoApplication().open();
      case Applications.neofetch:
        // closeApp(
        //   NeofetchApplication().open(
        //     value.user,
        //     value.name,
        //     value.isBrowser ? 'PC' : 'Mobile',
        //     value.browserName,
        //     value.deviceData,
        //     value.orientation,
        //     value.resolution,
        //     window.matchMedia('(prefers-color-scheme: dark)').matches
        //       ? 'Dark'
        //       : 'Light',
        //     window.navigator.language,
        //     new Date().getTimezoneOffset()
        //   ) as string
        // );
        neofetch.execute('', closeApp, valuee);
        break;
      // return children;
      case Applications.sl:
        return SlApplication().open();
      case Applications.cowsay:
        return closeApp(
          CowSayApplication().open(value.message, value.character) as string
        );
      default:
        return children;
    }
  };
  return <>{switchApp()}</>;
};

export default AppsProvider;
