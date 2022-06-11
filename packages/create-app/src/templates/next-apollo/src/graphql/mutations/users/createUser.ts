import { gql } from '@apollo/client';

import { CreateUserArgs } from '@/api/graphql/schemas/users/types';

import { USER, User } from '../../fragments/User';

export type CreateUserVars = CreateUserArgs;

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
