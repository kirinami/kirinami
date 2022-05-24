# Nest Starter

This project was bootstrapped with [NestJS](https://github.com/nestjs/nest) and [TypeORM](https://github.com/typeorm/typeorm).

## Available Scripts

In the project directory, you can run:

### `yarn typeorm schema:drop`

Drops all tables in the database on your default connection.

### `yarn typeorm migration:run`

Runs all pending migrations.

### `yarn typeorm migration:revert`

Reverts last executed migration.

### `yarn typeorm migration:generate -n <name> --pretty`

Generates a new migration file with sql needs to be executed to update schema.

### `yarn start:dev`

Runs the api in the development mode.\
Open [http://localhost:3000/docs](http://localhost:3000/docs) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the api for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your api is ready to be deployed!

## Learn More

You can learn more in the [NestJS documentation](https://docs.nestjs.com/) and [TypeORM documentation](https://typeorm.io/).
