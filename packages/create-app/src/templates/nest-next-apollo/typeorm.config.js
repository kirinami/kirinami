try {
  require('ts-node').register({
    project: './tsconfig.nest.json',
  });
  require('tsconfig-paths').register({
    project: './tsconfig.nest.json',
  });
} catch (err) {
} finally {
  require('./env.config');
}

const { DataSource } = require('typeorm');

module.exports = {
  default: new DataSource({
    cli: {
      migrationsDir: 'db/migrations',
    },
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_USER,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    synchronize: false,
    logging: ['warn', 'error'],
    migrations: ['db/migrations/*.{js,ts}'],
    entities: ['src/**/*.entity.{js,ts}'],
    migrationsTableName: 'migrations',
    metadataTableName: 'metadata',
  }),
};
