import { IApplication } from '../IApplication';
import Sl from './SL';

export const SlApplication: IApplication = () => {
  const open = () => {
    return Sl();
  };

  return { open };
};
