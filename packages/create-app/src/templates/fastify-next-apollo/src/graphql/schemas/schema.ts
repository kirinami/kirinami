import { gql } from 'apollo-server-micro';
import { makeExecutableSchema } from '@graphql-tools/schema';

import authDefs from './auth/defs';
import usersDefs from './users/defs';
import todosDefs from './todos/defs';
import authResolvers from './auth/resolvers';
import usersResolvers from './users/resolvers';
import todosResolvers from './todos/resolvers';

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
