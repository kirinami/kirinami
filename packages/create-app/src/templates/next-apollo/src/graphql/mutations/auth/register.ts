import { gql } from '@apollo/client';

import { RegisterArgs } from '@/server/graphql/schemas/auth/types';

import { AUTH, Auth } from '../../fragments/Auth';

export type RegisterVars = RegisterArgs;

export type RegisterData = {
  register: Auth,
};

export const REGISTER = gql`
  ${AUTH}

  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...Auth
    }
  }
`;
