/* eslint-disable no-console */

import chalk from 'chalk';

export const infoType = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
});

export default function info(message, type) {
  switch (type) {
    case infoType.ERROR: {
      console.error(chalk.red(message));
      break;
    }
    case infoType.SUCCESS: {
      console.log(chalk.green(message));
      break;
    }
    default: console.log(message);
  }
}
