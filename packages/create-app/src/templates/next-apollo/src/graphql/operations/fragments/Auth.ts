import { gql } from '@apollo/client';

export const AUTH = gql`
  fragment Auth on Auth {
    accessToken
    refreshToken
  }
`;
