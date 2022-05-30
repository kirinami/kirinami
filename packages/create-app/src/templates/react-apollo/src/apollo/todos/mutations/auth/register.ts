import { gql } from '@apollo/client';

export type RegisterMutation = {
  register: {
    accessToken: string,
    refreshToken: string,
  },
};

export type RegisterInput = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
};

export const REGISTER_MUTATION = gql`
  mutation Register($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    register(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;
