import { gql } from '@apollo/client';

import type { CreateUserArgs } from '@/api/users/args/create-user.args';

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
