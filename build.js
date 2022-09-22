import cliSelect from 'cli-select';
import chalk from 'chalk';
import childProcess from 'child_process';

let command = 'npm run ';

const selectMode = async () => {
  console.log('\n', chalk.yellow('어떻게 시작하시겠습니까?'), '\n');
  return cliSelect({
    values: ['Development', 'Production'],
    selected: '(*)',
    unselected: '( )',
    valueRenderer: (value, selected) => {
      if (selected) {
        return chalk.green.underline(value);
      }

      return chalk.gray(value);
    },
  });
};

const selectBuildType = async selectMode => {
  // console.log('', chalk.yellow(`${[selectMode]} ---> pc or mobile`), '\n');
  return cliSelect({
    values: ['all', 'javascript', 'scss'],
    valueRenderer: (value, selected) => {
      if (selected) {
        return chalk.green.underline(value);
      }
      return chalk.gray(value);
    },
  });
};

const startMode = await selectMode();
// dev
if (startMode.id === 0) {
  command += `dev`;
}
// build
else {
  const buildType = await selectBuildType();
  if (buildType.id === 1) {
    command += `build:js`;
  } else if (buildType.id === 2) {
    command += `build:css`;
  } else {
    command += `build`;
  }
}

console.log(chalk.green.bold('', 'run command --> ', command));
chalk.white('');
const process = childProcess.exec(command);

process.stdout.on('data', data => {
  console.log(chalk.gray.dim(data.toString()));
});

process.stderr.on('data', data => {
  console.error(chalk.red(data.toString()));
});
