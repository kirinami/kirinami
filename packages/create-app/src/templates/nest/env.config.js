const fs = require('fs-extra');
const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV || 'development';

let override = true;

[`.env.${NODE_ENV}.local`, '.env.local', `.env.${NODE_ENV}`, '.env'].forEach((dotenvFile) => {
  if (!fs.existsSync(dotenvFile)) {
    return;
  }

  dotenv.config({
    path: dotenvFile,
    override,
  });

  if (override) {
    override = false;
  }
});
