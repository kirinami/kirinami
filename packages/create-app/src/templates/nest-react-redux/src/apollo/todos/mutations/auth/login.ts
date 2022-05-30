import { gql } from '@apollo/client';

export type LoginMutation = {
  login: {
    accessToken: string,
    refreshToken: string,
  },
};

export type LoginInput = {
  email: string,
  password: string,
};

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;
