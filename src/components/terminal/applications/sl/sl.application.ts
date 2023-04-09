import { IApplication } from '../IApplication';
import Sl from './SL';

export const SlApplication: IApplication = () => {
  const open = (close: (output?: string) => void) => {
    return Sl({ close });
  };

  return { open };
};
