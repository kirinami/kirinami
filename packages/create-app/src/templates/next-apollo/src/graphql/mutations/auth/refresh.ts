import { gql } from '@apollo/client';

import { RefreshArgs } from '@/api/graphql/schemas/auth/types';

import { AUTH, Auth } from '../../fragments/Auth';

export type RefreshVars = RefreshArgs;

export type RefreshData = {
  refresh: Auth,
};

export const REFRESH = gql`
  ${AUTH}

  mutation Refresh($token: String!) {
    refresh(token: $token) {
      ...Auth
    }
  }
`;
