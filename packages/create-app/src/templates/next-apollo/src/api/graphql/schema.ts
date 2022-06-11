import { gql } from 'apollo-server-micro';
import { makeExecutableSchema } from '@graphql-tools/schema';

import authDefs from './schemas/auth/defs';
import usersDefs from './schemas/users/defs';
import todosDefs from './schemas/todos/defs';
import authResolvers from './schemas/auth/resolvers';
import usersResolvers from './schemas/users/resolvers';
import todosResolvers from './schemas/todos/resolvers';

export default makeExecutableSchema({
  typeDefs: [
    gql`
      scalar DateTime
    `,
    authDefs,
    usersDefs,
    todosDefs,
  ],
  resolvers: [
    authResolvers,
    usersResolvers,
    todosResolvers,
  ],
});
