import program from 'commander';

program
  .version('0.0.1')
  .command('init', 'init translation.io')
  .command('sync', 'sync translation.io')
  .parse(process.argv);
