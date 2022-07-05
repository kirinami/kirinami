import { gql } from '@apollo/client';

import { USER } from '../../fragments/User';

export const UPDATE_USER = gql`
  ${USER}

  mutation UpdateUser($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...User
    }
  }
`;
