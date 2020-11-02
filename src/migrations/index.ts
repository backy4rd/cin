import * as movies from './movies';

async function main() {
  if (process.argv[2] === 'up') {
    await movies.up();
  } else if (process.argv[2] === 'down') {
    await movies.down();
  }
}

main();
