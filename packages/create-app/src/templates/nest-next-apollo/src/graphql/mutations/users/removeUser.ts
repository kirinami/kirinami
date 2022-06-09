import { gql } from '@apollo/client';

import type { RemoveUserArgs } from '@/api/users/args/remove-user.args';

import { USER, User } from '../../fragments/User';

export type RemoveUserVars = RemoveUserArgs;

export type RemoveUserData = {
  removeUser: User,
};

export const REMOVE_USER = gql`
  ${USER}

  mutation RemoveUser($id: Int!) {
    removeUser(id: $id) {
      ...User
    }
  }
`;
