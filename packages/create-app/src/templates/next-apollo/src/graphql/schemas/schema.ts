import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { makeExecutableSchema } from '@graphql-tools/schema';

import uploadsSchema from './uploads/schema';
import authSchema from './auth/schema';
import usersSchema from './users/schema';
import todosSchema from './todos/schema';

const schema = makeExecutableSchema({
  typeDefs: [
    fs.readFileSync(path.resolve(fileURLToPath(import.meta.url), '..', './schema.graphql'), 'utf-8'),
    uploadsSchema.typeDefs,
    authSchema.typeDefs,
    usersSchema.typeDefs,
    todosSchema.typeDefs,
  ],
  resolvers: [uploadsSchema.resolvers, authSchema.resolvers, usersSchema.resolvers, todosSchema.resolvers],
});

export default schema;
