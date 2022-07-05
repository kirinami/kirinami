import { gql } from '@apollo/client';

import { USER } from '../../fragments/User';

export const CREATE_USER = gql`
  ${USER}

  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...User
    }
  }
`;
