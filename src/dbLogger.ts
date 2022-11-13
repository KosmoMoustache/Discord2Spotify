import {
  type ActionHistory,
  type TableActionHistory,
  ActionType,
} from './interfaces';
import tn from './constants';
import db from './db';

export default {
  insert: async ({
    user_id,
    action_type,
    metadata,
    url,
  }: Omit<ActionHistory, 'id' | 'created_at' | 'updated_at'>) => {
    return await db
      .insert(<TableActionHistory>{
        user_id: user_id,
        action_type: action_type,
        metadata: metadata,
        url: url,
      })
      .into(tn.action_history);
  },
  select: async (user_id?: number, action_type?: ActionType, url?: string) => {
    return await db.select().from(tn.action_history).where({
      user_id,
      action_type,
      url,
    });
  },
};
