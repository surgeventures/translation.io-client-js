#!/usr/bin/env node

import subcommand from './subcommand';
import { sync } from './';

subcommand(sync)((program) => {
  program
    .option('-p, --purge', 'Purge sync operation');
});
