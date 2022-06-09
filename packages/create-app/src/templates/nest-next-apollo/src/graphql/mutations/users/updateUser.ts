import { gql } from '@apollo/client';

import type { UpdateUserArgs } from '@/api/users/args/update-user.args';

import { USER, User } from '../../fragments/User';

export type UpdateUserVars = UpdateUserArgs;

export type UpdateUserData = {
  updateUser: User,
};

export const UPDATE_USER = gql`
  ${USER}

  mutation UpdateUser($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...User
    }
  }
`;
