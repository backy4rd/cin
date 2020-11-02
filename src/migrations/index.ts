import knex from '../providers/database';
import * as movies from './movies';
import * as schedules from './schedules';

(async () => {
  if (process.argv[2] === 'up') {
    await movies.up();
    await schedules.up();
  } else if (process.argv[2] === 'down') {
    await schedules.down();
    await movies.down();
  }

  await knex.destroy();
})();
