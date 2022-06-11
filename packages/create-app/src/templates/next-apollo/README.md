# Next-Apollo Starter

This project was bootstrapped with [Next.js](https://nextjs.org/), [Apollo GraphQL](https://www.apollographql.com/)
and [Prisma](https://www.prisma.io/).

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

Builds the app for production to the `.next` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Learn More

You can learn more in the [Next.js Documentation](https://nextjs.org/docs/), [Apollo GraphQL Documentation](https://www.apollographql.com/docs/)
and [Prisma Documentation](https://www.prisma.io/docs/).

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
