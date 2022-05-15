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
    name: 'nest-next',
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

const templates = frameworks.reduce((templates, framework) => [
  ...templates, ...framework.variants.map((variant) => `${framework.name}${variant.name === 'base' ? '' : `-${variant.name}`}`),
], []);

function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName,
  );
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-');
}

function isEmpty(path) {
  if (!fs.existsSync(path)) {
    return true;
  }

  const files = fs.readdirSync(path);
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

  let result = {};

  try {
    result = await prompts(
      [
        {
          type: targetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: defaultProjectName,
          onState: (state) => (targetDir = state.value.trim().replace(/\/+$/g, '') || defaultProjectName),
        },
        {
          type: () => isEmpty(targetDir) ? null : 'confirm',
          name: 'overwrite',
          message: () => (targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`) + ` is not empty. Remove existing files and continue?`,
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
          type: template && templates.includes(template) ? null : 'select',
          name: 'framework',
          message: typeof template === 'string' && !templates.includes(template)
            ? reset(`"${template}" isn't a valid template. Please choose from below: `)
            : reset('Select a framework:'),
          initial: 0,
          choices: frameworks.map((framework) => ({
            title: framework.color(framework.name),
            value: framework,
          })),
        },
        {
          type: (framework) => framework && framework.variants ? 'select' : null,
          name: 'variant',
          message: reset('Select a variant:'),
          choices: (framework) => framework.variants.map((variant) => ({
            title: variant.color(variant.name),
            value: variant.name,
          })),
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled');
        },
      },
    );
  } catch (err) {
    console.log(err.message);
    return;
  }

  const { framework, overwrite, packageName, variant } = result;

  const root = path.join(cwd, targetDir);

  if (overwrite) {
    fs.emptyDirSync(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  template = variant ? `${framework.name}${variant === 'base' ? '' : `-${variant}`}` : template;

  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.join(__dirname, 'templates', template);

  fs.copySync(path.join(templateDir), root);

  const pkg = fs.readJsonSync(path.join(root, `package.json`));
  pkg.name = packageName || targetDir;
  fs.writeJsonSync(path.join(root, 'package.json'), pkg, { spaces: 2 });

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm';

  console.log(`\nDone. Now run:\n`);

  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`);
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
  .catch(console.error);
