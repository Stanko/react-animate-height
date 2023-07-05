const fs = require('fs');
const path = require('path');

const version = require(path.resolve(__dirname, '..', 'package.json')).version;

// ----- ESM ----- //
const esmPackageJsonPath = path.resolve(
  __dirname,
  '..',
  'dist',
  'esm',
  'package.json'
);
const esmPackageJson = {
  version,
  type: 'module',
};

fs.writeFileSync(esmPackageJsonPath, JSON.stringify(esmPackageJson, null, 2), {
  encoding: 'utf-8',
});

// ----- COMMON JS ----- //
const cjsPackageJsonPath = path.resolve(
  __dirname,
  '..',
  'dist',
  'cjs',
  'package.json'
);
const cjsPackageJson = {
  version,
  type: 'commonjs',
};

fs.writeFileSync(cjsPackageJsonPath, JSON.stringify(cjsPackageJson, null, 2), {
  encoding: 'utf-8',
});
