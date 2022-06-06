import { gql } from '@apollo/client';

export type RegisterVars = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
};

export type RegisterData = {
  register: {
    accessToken: string,
    refreshToken: string,
  },
};

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
    }
  }
`;
