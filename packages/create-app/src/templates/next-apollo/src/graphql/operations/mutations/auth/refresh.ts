import { gql } from '@apollo/client';

import { AUTH } from '../../fragments/Auth';

export const REFRESH = gql`
  ${AUTH}

  mutation Refresh($token: String!) {
    refresh(token: $token) {
      ...Auth
    }
  }
`;
