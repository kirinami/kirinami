import { gql } from '@apollo/client';

import { AUTH } from '../../fragments/Auth';

export const LOGIN = gql`
  ${AUTH}

  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...Auth
    }
  }
`;
