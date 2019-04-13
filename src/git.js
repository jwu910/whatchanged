const { spawn } = require('child_process');

let gitResponse;

/**
 * Kill the most recently created child process
 * Used to force exit from loading box
 */
export const closeGitResponse = () => {
  gitResponse.kill();
};

/**
 * Return name of current branch.
 *
 * Returns a promise that resolves to the current branch name.
 */
export const getCurrentBranch = () => {
  const args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  return execGit(args);
};

/**
 * Execute git command with passed arguments.
 * <args> is expected to be an array of strings.
 * Example: ['fetch', '-pv']
 */
const execGit = args => {
  return new Promise((resolve, reject) => {
    let dataString = '';
    let errorString = '';

    gitResponse = spawn('git', args);

    gitResponse.stdout.setEncoding('utf8');
    gitResponse.stderr.setEncoding('utf8');

    gitResponse.stdout.on('data', data => (dataString += data));
    gitResponse.stderr.on('data', data => (errorString += data));

    gitResponse.on('exit', (code, signal) => {
      if (code === 0) {
        resolve(dataString.toString());
      } else if (signal === 'SIGTERM') {
        reject(signal);
      } else {
        reject(errorString.toString());
      }
    });
  });
};

