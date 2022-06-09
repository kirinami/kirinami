import { gql } from '@apollo/client';

export type Auth = {
  accessToken: string,
  refreshToken: string,
};

export const AUTH = gql`
  fragment Auth on AuthOutput {
    accessToken
    refreshToken
  }
`;
