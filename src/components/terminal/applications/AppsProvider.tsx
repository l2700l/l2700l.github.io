import React, { ReactNode } from 'react';
import { Applications } from './applicationsEnum';
import { NeofetchApplication } from './neofetch/neofetch.application';
import { SlApplication } from './sl/sl.application';
import { NanoApplication } from './nano/nano.application';
import { CowSayApplication } from './cowsay/cowsay.application';

// @ts-ignore
const AppsProvider: React.FC<{
  value: { [key: string]: any };
  currentApp: Applications | undefined;
  closeApp: (output?: string) => void;
  children: ReactNode | undefined;
}> = ({ value, children, currentApp, closeApp }) => {
  const switchApp = () => {
    if (currentApp === undefined) return children;
    switch (currentApp) {
      case Applications.nano:
        // TODO: realize nano app
        return NanoApplication().open();
      case Applications.neofetch:
        closeApp(
          NeofetchApplication().open(
            value.user,
            value.name,
            value.isBrowser ? 'PC' : 'Mobile',
            value.browserName,
            value.deviceData,
            value.orientation,
            value.resolution,
            window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'Dark'
              : 'Light',
            window.navigator.language,
            new Date().getTimezoneOffset()
          ) as string
        );
        return children;
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
