const { spawn } = require('child_process');
const path = require('path');

console.log('Starting development server...');

const tsNode = spawn('node', [
  '-r',
  'ts-node/register',
  path.join(__dirname, 'src/server.ts')
], {
  stdio: 'inherit',
  shell: true
});

tsNode.on('close', (code) => {
  console.log(`Server stopped with code ${code}`);
  process.exit(code);
});