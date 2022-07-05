import { gql } from '@apollo/client';

import { AUTH } from '../../fragments/Auth';

export const REGISTER = gql`
  ${AUTH}

  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...Auth
    }
  }
`;
