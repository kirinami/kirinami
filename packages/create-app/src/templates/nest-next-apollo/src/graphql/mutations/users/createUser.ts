import { gql } from '@apollo/client';

import { USER, User } from '../../fragments/User';

export type CreateUserVars = {
  input: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles?: string[],
  },
};

export type CreateUserData = {
  createUser: User,
};

export const CREATE_USER = gql`
  ${USER}

  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...User
    }
  }
`;
