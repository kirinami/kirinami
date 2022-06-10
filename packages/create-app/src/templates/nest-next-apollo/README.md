# Nest-Next-Apollo Starter

This project was bootstrapped with [Nest.js](https://github.com/nestjs/nest), [Next.js](https://github.com/vercel/next.js)
and [Prisma](https://github.com/prisma/prisma).

## Available Scripts

In the project directory, you can run:

### `yarn prisma migrate reset`

Drops all tables in the database on your default connection.

### `yarn prisma migrate deploy`

Runs all pending migrations.

### `yarn prisma migrate dev`

Generates a new migration file with sql needs to be executed to update schema.

### `yarn dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `.nest` and `.next` folders.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Learn More

You can learn more in the [Nest.js docs](https://docs.nestjs.com/), [Next.js docs](https://nextjs.org/docs/getting-started)
and [Prisma docs](https://www.prisma.io/docs/).

## Deploy via Docker

docker-compose.yml

```yaml
version: "3.8"

services:
  postgres:
    env_file:
      - .env
    image: postgres:13.2-alpine
    healthcheck:
      test: pg_isready -q -d ${POSTGRES_USER} -U ${POSTGRES_USER}
      start_period: 5s
      interval: 5s
    restart: unless-stopped

  app:
    depends_on:
      postgres:
        condition: service_healthy
    env_file:
      - .env
    build: .
    ports:
      - 3000:3000
    restart: unless-stopped
```
