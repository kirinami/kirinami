import { gql } from '@apollo/client';

import { USER } from '../../fragments/User';

export const DELETE_USER = gql`
  ${USER}

  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      ...User
    }
  }
`;
