# Nest.js + RestAPI

## Getting Started

First, run the development server:

```bash
COMPOSE_PROJECT_NAME=nest-restapi docker compose -f docker-compose.yml -f docker-compose.dev.yml up postgres
```

and after:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

----

For stop docker container:

```bash
COMPOSE_PROJECT_NAME=nest-restapi docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```
