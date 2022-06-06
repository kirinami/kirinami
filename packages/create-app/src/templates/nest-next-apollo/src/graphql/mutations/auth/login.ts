import { gql } from '@apollo/client';

export type LoginVars = {
  email: string,
  password: string,
};

export type LoginData = {
  login: {
    accessToken: string,
    refreshToken: string,
  },
};

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;
