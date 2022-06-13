import { gql } from 'apollo-server-core';
import { IExecutableSchemaDefinition, makeExecutableSchema } from '@graphql-tools/schema';

import authSchema from './schemas/auth/schema';
import usersSchema from './schemas/users/schema';
import todosSchema from './schemas/todos/schema';
import uploadsSchema from './schemas/uploads/schema';

const defaultSchema: IExecutableSchemaDefinition = {
  typeDefs: [
    gql`
      scalar DateTime

      type Query
      type Mutation
      type Subscription
    `,
  ],
  resolvers: [],
};

export default makeExecutableSchema([
  authSchema,
  usersSchema,
  todosSchema,
  uploadsSchema,
].reduce((definition, schema) => {
  if (Array.isArray(definition.typeDefs) && 'typeDefs' in schema) definition.typeDefs.push(schema.typeDefs);
  if (Array.isArray(definition.resolvers) && 'resolvers' in schema) definition.resolvers.push(schema.resolvers);

  return definition;
}, defaultSchema));
