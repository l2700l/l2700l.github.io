import { IApplication } from '../IApplication';
import Nano from './Nano';

export const NanoApplication: IApplication = () => {
  const open = () => {
    return Nano();
  };

  return { open };
};
