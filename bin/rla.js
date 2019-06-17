#! /usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
// const https = require('https');
const { exec } = require('child_process');

const packageJson = require('../package.json');

const scripts = `"scripts": {
    "start": "NODE_ENV=development webpack-dev-server --config webpack/webpack.development.js", 
    "prod:build": "NODE_ENV=development webpack --config webpack/webpack.production.js",
    "test": "jest"
}`;

const launchDirectory = process.argv[2];

const filesToCopy = [
  'README.md',
  '.eslintrc',
  '.babelrc',
  '.npmrc',
  '.prettierrc',
  'jest.config.js',
];

/**
 * we pass the object key dependency || devdependency to this function
 * @param {object} deps object key that we want to extract
 * @returns {string} a string of 'dependencies@version'
 * that we can attach to an `npm i {value}` to install
 * every dep the exact version speficied in package.json
 */
const getAppDependencies = deps =>
  Object.entries(deps)
    .map(dep => `${dep[0]}@${dep[1]}`)
    .toString()
    .replace(/,/g, ' ')
    .replace(/^/g, '')
    // exclude the plugin only used in this file, nor relevant to the boilerplate
    .replace(/fs-extra[^\s]+/g, '');

console.log('Launching your new project..');

const addScripts = () => {
  const packageJSON = `${launchDirectory}/package.json`;

  fs.readFile(packageJSON, (err, file) => {
    if (err) {
      throw err;
    }

    const data = file.toString().replace('"private": true', scripts);
    fs.writeFile(packageJSON, data, err2 => err2 || true);
  });
};

const copyConfigFiles = () => {
  for (let i = 0; i < filesToCopy.length; i += 1) {
    fs.createReadStream(path.join(__dirname, `../${filesToCopy[i]}`)).pipe(
      fs.createWriteStream(`${launchDirectory}/${filesToCopy[i]}`),
    );
  }
};

const createGitIgnore = () => {
  exec(`cd ${launchDirectory} && touch .gitignore`, () => {
    console.log('create git ignore');
    const gitIgnore = `${launchDirectory}/.gitignore`;

    fs.readFile(path.join(__dirname, '../.gitignore'), (err, file) => {
      if (err) {
        throw err;
      }

      const data = file.toString();
      console.log('data', data);
      fs.writeFile(gitIgnore, data, err2 => err2 || true);
    });
  });
};

// create folder and initialize npm
exec(
  `mkdir ${launchDirectory} && cd ${launchDirectory} && yarn init -yp`,
  (initErr, initStdout, initStderr) => {
    if (initErr) {
      console.error(`Everything was fine, then it wasn't: ${initErr}`);
      return;
    }

    addScripts();
    copyConfigFiles();
    createGitIgnore();

    console.log('yarn init -- done\n');

    // install dependencies
    console.log('Lets install dependencies -- it might take a few minutes..');

    const devDeps = getAppDependencies(packageJson.devDependencies);
    const deps = getAppDependencies(packageJson.dependencies);

    exec(
      `cd ${launchDirectory} && yarn add -D ${devDeps} && yarn add ${deps}`,
      (yarnErr, yarnStdout, yarnStderr) => {
        if (yarnErr) {
          console.error(`Package install error ${yarnErr}`);
          return;
        }

        console.log(yarnStdout);
        console.log('Dependencies installed');
        console.log('Copying additional files..');

        // copy additional source files
        Promise.all([
          fs.copy(path.join(__dirname, '../src'), `${launchDirectory}/src`),
          fs.copy(
            path.join(__dirname, '../assets'),
            `${launchDirectory}/assets`,
          ),
          fs.copy(path.join(__dirname, '../test'), `${launchDirectory}/test`),
          fs.copy(
            path.join(__dirname, '../webpack'),
            `${launchDirectory}/webpack`,
          ),
        ])
          .then(() =>
            console.log(
              `All done!\nYour project is now started into ${launchDirectory} folder, refer to the README for the project structure.\nHappy Coding!`,
            ),
          )
          .catch(err => console.error(err));
      },
    );
  },
);
