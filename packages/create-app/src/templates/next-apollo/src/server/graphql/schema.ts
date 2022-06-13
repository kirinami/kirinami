import { gql } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';

import authSchema from './schemas/auth/schema';
import usersSchema from './schemas/users/schema';
import todosSchema from './schemas/todos/schema';
import uploadsSchema from './schemas/uploads/schema';

export default makeExecutableSchema({
  typeDefs: [
    gql`
      scalar DateTime

      type Query
      type Mutation
      type Subscription
    `,
    authSchema.typeDefs,
    usersSchema.typeDefs,
    todosSchema.typeDefs,
    uploadsSchema.typeDefs,
  ],
  resolvers: [
    authSchema.resolvers,
    usersSchema.resolvers,
    todosSchema.resolvers,
    uploadsSchema.resolvers,
  ],
});
