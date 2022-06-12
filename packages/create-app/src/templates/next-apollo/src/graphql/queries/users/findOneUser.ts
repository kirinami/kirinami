import { gql } from '@apollo/client';

import { FindOneUserArgs } from '@/server/graphql/schemas/users/types';

import { USER, User } from '../../fragments/User';

export type FindOneUserVars = FindOneUserArgs;

export type FindOneUserData = {
  findOneUser: User,
};

export const FIND_ONE_USER = gql`
  ${USER}

  query FindOneUser($id: Int) {
    findOneUser(id: $id) {
      ...User
    }
  }
`;
