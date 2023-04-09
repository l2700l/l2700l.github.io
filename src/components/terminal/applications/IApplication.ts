import React from 'react';

export interface IApplication {
  (...args: any[]): {
    open: (
      ...args: any[]
    ) => JSX.Element | React.ReactElement<any, any> | null | string;
    close?: () => string;
  };
}
