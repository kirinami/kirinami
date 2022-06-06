import { gql } from '@apollo/client';

import { USER, User } from '../../fragments/User';

export type RemoveUserVars = {
  id: number,
};

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
