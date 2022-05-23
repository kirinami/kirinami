#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2), { string: ['_'] });
const prompts = require('prompts');
const { yellow, green, cyan, blue, magenta, lightRed, red, reset } = require('kolorist');

const cwd = process.cwd();

const frameworks = [
  {
    name: 'nest',
    color: green,
    variants: [
      {
        name: 'base',
        color: green,
      },
      {
        name: 'apollo',
        color: yellow,
      },
    ],
  },
  {
    name: 'nest+next',
    color: yellow,
    variants: [
      {
        name: 'base',
        color: yellow,
      },
      {
        name: 'apollo',
        color: magenta,
      },
      {
        name: 'redux',
        color: lightRed,
      },
    ],
  },
  {
    name: 'next',
    color: cyan,
    variants: [
      {
        name: 'base',
        color: cyan,
      },
      {
        name: 'apollo',
        color: yellow,
      },
      {
        name: 'redux',
        color: blue,
      },
    ],
  },
];

const isEmptyDir = (dir) => {
  if (!fs.existsSync(dir)) {
    return true;
  }

  const files = fs.readdirSync(dir);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
};

const formatProjectName = (projectName) => projectName
  .trim()
  .replace(/\W+/g, '-')
  .replace(/^-+/g, '')
  .replace(/-+$/g, '');

async function main() {
  const targetDir = argv._[0] ? path.resolve(argv._[0]) : null;

  const template = argv.template || argv.t || null;
  const templateFramework = template?.split('-')[0];
  const templateVariant = template?.split('-')[1];

  const defaultProjectName = targetDir ? path.basename(targetDir) : 'app';
  const defaultFramework = frameworks.find(framework => framework.name === templateFramework) || null;
  const defaultVariant = defaultFramework?.variants.find(variant => {
    variant.name === (templateVariant == null ? 'base' : templateVariant);

    if (templateVariant === undefined) {
      return variant.name === 'base';
    }

    if (templateVariant === '') {
      return false;
    }

    return variant.name === templateVariant;
  }) || null;

  const {
    projectName = defaultProjectName,
    overwrite = false,
    framework = defaultFramework,
    variant = defaultVariant,
  } = await prompts(
    [
      {
        type: targetDir ? null : 'text',
        name: 'projectName',
        message: reset('Project name:'),
        initial: defaultProjectName,
        format: (value) => formatProjectName(value),
      },
      {
        type: () => isEmptyDir(targetDir) ? null : 'confirm',
        name: 'overwrite',
        message: () => (targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`) + ' is not empty. Remove existing files and continue?',
      },
      {
        type: (_, { overwrite }) => {
          if (overwrite === false) {
            throw new Error(red('✖') + ' Operation cancelled');
          }

          return null;
        },
        name: 'overwriteChecker',
      },
      {
        type: !defaultFramework ? 'select' : null,
        name: 'framework',
        message: typeof template === 'string' && !defaultFramework
          ? reset(`"${template}" isn't a valid framework. Please choose from below: `)
          : reset('Select a framework:'),
        choices: frameworks.map((framework) => ({
          title: framework.color(framework.name),
          value: framework,
        })),
      },
      {
        type: !defaultVariant ? 'select' : null,
        name: 'variant',
        message: reset('Select a variant:'),
        choices: (framework = defaultFramework) => framework.variants.map((variant) => ({
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

  const projectDir = path.resolve(cwd, targetDir || projectName);

  if (overwrite) {
    fs.emptyDirSync(projectDir);
  } else if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  console.log(`${yellow('➔')} Scaffolding project in ${projectDir}`);

  fs.copySync(path.join(__dirname, 'frameworks', framework.name), projectDir);

  if (variant && variant.name !== 'base') {
    fs.copySync(path.join(__dirname, 'variants', `${framework.name}-${variant.name}`), projectDir);
  }

  const pkg = fs.readJsonSync(path.join(projectDir, `package.json`));
  pkg.name = projectName;
  fs.writeJsonSync(path.join(projectDir, 'package.json'), pkg, { spaces: 2 });

  console.log(`${green('✔')} Done`);
}

main()
  .catch((err) => console.error(err.message));
