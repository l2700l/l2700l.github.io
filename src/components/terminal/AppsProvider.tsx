import React, { useMemo } from 'react';
import { Applications } from './applications/applicationsEnum';
import { NeofetchApplication } from './applications/neofetch/neofetch.application';
import { TerminalContext } from './TerminalContext';
import { SlApplication } from './applications/sl/sl.application';

const AppsProvider: React.FC<
  React.HtmlHTMLAttributes<HTMLDivElement> & {
    value: { [key: string]: any };
    currentApp: Applications | undefined;
    closeApp: (output?: string) => void;
  }
> = ({ value, children, currentApp, closeApp }) => {
  const switchApp = () => {
    if (currentApp === undefined) return children;
    switch (currentApp) {
      case Applications.nano:
        // TODO: realize nano app
        return <div></div>;
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
        break;
      case Applications.fs:
        return SlApplication().open();
        break;
      default:
        return children;
    }
  };
  return (
    <TerminalContext.Provider
      value={{ ...value, currentApp, closeApp: closeApp }}
    >
      {switchApp()}
    </TerminalContext.Provider>
  );
};

export default AppsProvider;
