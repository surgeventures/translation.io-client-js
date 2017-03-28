import attempt from 'lodash.attempt';
import program from 'commander';

export default function subcommand(fn) {
  program
    .option('-c, --config [path]', 'A config file')
    .option('-k, --apiKey [key]', 'A api key')
    .option('-g, --gemVersion [version]', 'A current gem version');

  return (extended) => {
    attempt(extended, program);

    program.parse(process.argv);

    fn({
      gemVersion: program.gemVersion,
      apiKey: program.apiKey,
      config: program.config,
      purge: program.purge,
    });
  };
}
