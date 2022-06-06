import { gql } from '@apollo/client';

import { USER, User } from '../../fragments/User';

export type UpdateUserVars = {
  id: number,
  input: {
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    roles?: string[],
  },
};

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
