import ping from './ping';
import channel from './channel';
import register from './register';
import stats from './stats';
import enable from './enable';
import { ICommand } from '../../interfaces';

// TODO: Add commands cooldown
// TODO: add recap commands + web page
// TODO: Remove command ping (+deploy_commands)
export default <Record<string, ICommand>>{
  ping,
  channel,
  register,
  stats,
  enable,
};
