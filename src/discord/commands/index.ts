import ping from './ping';
import channel from './channel';
import register from './register';
import stats from './stats';
import enable from './enable';
import locale from './locale';
import read from './read';
import type { ICommand } from '../../interfaces';

export default <Record<string, ICommand>>{
  ping,
  channel,
  register,
  stats,
  enable,
  locale,
  read,
};
