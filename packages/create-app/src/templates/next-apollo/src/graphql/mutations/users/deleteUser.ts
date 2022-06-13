import { gql } from '@apollo/client';

import { DeleteUserArgs } from '@/api/graphql/schemas/users/types';

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
