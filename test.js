const { spawn } = require('node:child_process');

const server = spawn('npm', ['run', 'start:test']);

server.stdout.on('data', (data) => {
  console.log(`server stdout: ${data}`);

  const cypress = spawn('npm', ['run', 'cypress:run'], { stdio: 'inherit' });

  cypress.on('close', (code) => {
    console.log(`cypress process exited with code ${code}`);
    server.exitCode = 0;
    server.kill('SIGINT');
  });
});

// server.stderr.on('data', (data) => {
//   console.error(`server stderr: ${data}`);
// });

server.on('close', (code) => {
  console.log(`server process exited with code ${code}`);
});
