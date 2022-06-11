#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';
import prompts from 'prompts';
import { blue, green, lightRed, magenta, red, reset } from 'kolorist';

const argv = minimist(process.argv.slice(2), { string: ['_'] });
const cwd = process.cwd();

const frameworks = [
  {
    name: 'nest',
    color: lightRed,
    variants: [
      {
        name: 'nest',
        color: lightRed,
      },
      {
        name: 'nest-apollo',
        color: magenta,
      },
    ],
  },
  {
    name: 'next',
    color: green,
    variants: [
      {
        name: 'next',
        color: green,
      },
      {
        name: 'next-apollo',
        color: magenta,
      },
      {
        name: 'next-redux',
        color: blue,
      },
    ],
  },
];

const templates = frameworks.flatMap((framework) => framework?.variants.map((v) => v.name) || [framework.name]);

const renameFiles = {};

function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName);
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-');
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isEmptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return true;
  }

  const files = fs.readdirSync(dir);

  return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(' ')[0];
  const pkgSpecArr = pkgSpec.split('/');
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

async function main() {
  let targetDir = argv._[0];
  let template = argv.template || argv.t;

  const defaultProjectName = !targetDir ? 'app' : targetDir.trim().replace(/\/+$/g, '');

  const { overwrite, packageName, framework, variant } = await prompts(
    [
      {
        type: targetDir ? null : 'text',
        name: 'projectName',
        message: reset('Project name:'),
        initial: defaultProjectName,
        onState: (state) => (targetDir = state.value.trim().replace(/\/+$/g, '') || defaultProjectName),
      },
      {
        type: () => isEmptyDir(targetDir) ? null : 'confirm',
        name: 'overwrite',
        message: () => `${targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`} is not empty. Remove existing files and continue?`,
      },
      {
        type: (_, { overwrite } = {}) => {
          if (overwrite === false) {
            throw new Error(red('✖') + ' Operation cancelled');
          }

          return null;
        },
        name: 'overwriteChecker',
      },
      {
        type: () => (isValidPackageName(targetDir) ? null : 'text'),
        name: 'packageName',
        message: reset('Package name:'),
        initial: () => toValidPackageName(targetDir),
        validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name',
      },
      {
        type: templates.includes(template) ? null : 'select',
        name: 'framework',
        message: template && !templates.includes(template)
          ? reset(`"${template}" isn't a valid template. Please choose from below: `)
          : reset('Select a framework:'),
        initial: 0,
        choices: frameworks.map((framework) => ({
          title: framework.color(framework.name),
          value: framework,
        })),
      },
      {
        type: (framework) => framework?.variants ? 'select' : null,
        name: 'variant',
        message: reset('Select a variant:'),
        choices: (framework) => framework.variants.map((variant) => ({
          title: variant.color(variant.name),
          value: variant,
        })),
      },
    ],
    {
      onCancel: () => {
        throw new Error(red('✖') + ' Operation cancelled');
      },
    },
  );

  const rootDir = path.join(cwd, targetDir);

  if (overwrite) {
    fs.rmSync(rootDir, { recursive: true, force: true });
  } else if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir, { recursive: true });
  }

  // determine template
  template = variant?.name || framework?.name || template;

  console.log(`${green('✔')} Scaffolding project in ${rootDir}`);

  const templateDir = path.resolve(fileURLToPath(import.meta.url), `../templates/${template}`);

  const write = (file, content) => {
    const targetPath = path.join(rootDir, renameFiles[file] || file);

    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== 'package.json')) write(file);

  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'));
  pkg.name = packageName || targetDir;
  write('package.json', JSON.stringify(pkg, null, 2));

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm';

  console.log(`\n${green('✔')} Done. Now run:\n`);
  if (rootDir !== cwd) {
    console.log(`  cd ${path.relative(cwd, rootDir)}`);
  }
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn');
      console.log('  yarn dev');
      break;
    default:
      console.log(`  ${pkgManager} install`);
      console.log(`  ${pkgManager} run dev`);
      break;
  }
  console.log();
}

main()
  .catch((err) => console.error(err.message));
