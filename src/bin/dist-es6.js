import Project from '../lib/project';

async function run() {
  const project = new Project();
  const currentNpmCommand = JSON.parse(process.env.npm_config_argv).original[0];
  if (currentNpmCommand === 'install') {
    await project.linkAll();
  } else if (currentNpmCommand === 'publish') {
    await project.compile();
    const output = await project.directory.execSh('npm publish dist');
    if (output.trim()) {
      process.stdout.write(`${output.trim()}\n`);
    }
    await project.directory.rm('dist');
    process.kill(await project.directory.execSh('pgrep npm'));
  }
}

run().catch((error) => {
  process.stderr.write(`${error.stack}\n`);
  /* eslint-disable lines-around-comment, no-process-exit */
  process.exit(1);
  /* eslint-enable lines-around-comment, no-process-exit */
});
