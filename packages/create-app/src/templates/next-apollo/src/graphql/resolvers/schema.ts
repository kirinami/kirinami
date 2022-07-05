import fs from 'fs';
import { makeExecutableSchema } from '@graphql-tools/schema';

import uploads from './uploads/schema';
import auth from './auth/schema';
import users from './users/schema';
import todos from './todos/schema';

const schema = makeExecutableSchema({
  typeDefs: [
    fs.readFileSync('./schema.graphql', 'utf-8'),
    fs.readFileSync('./uploads/schema.graphql', 'utf-8'),
    fs.readFileSync('./auth/schema.graphql', 'utf-8'),
    fs.readFileSync('./users/schema.graphql', 'utf-8'),
    fs.readFileSync('./todos/schema.graphql', 'utf-8'),
  ],
  resolvers: [uploads, auth, users, todos],
});

export default schema;
