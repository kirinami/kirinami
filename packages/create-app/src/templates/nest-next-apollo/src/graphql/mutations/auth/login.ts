import { gql } from '@apollo/client';

import type { LoginArgs } from '@/api/auth/args/login.args';

import { AUTH, Auth } from '../../fragments/Auth';

export type LoginVars = LoginArgs;

export type LoginData = {
  login: Auth,
};

export const LOGIN = gql`
  ${AUTH}

  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...Auth
    }
  }
`;
