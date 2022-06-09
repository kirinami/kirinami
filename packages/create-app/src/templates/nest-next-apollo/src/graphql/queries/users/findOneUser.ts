import { gql } from '@apollo/client';

import type { FindOneUserArgs } from '@/api/users/args/find-one-user.args';

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
