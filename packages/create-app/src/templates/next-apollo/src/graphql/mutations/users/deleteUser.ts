import { gql } from '@apollo/client';

import { DeleteUserArgs } from '@/server/graphql/schemas/users/types';

import { USER, User } from '../../fragments/User';

export type DeleteUserVars = DeleteUserArgs;

export type DeleteUserData = {
  deleteUser: User,
};

export const DELETE_USER = gql`
  ${USER}

  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      ...User
    }
  }
`;
