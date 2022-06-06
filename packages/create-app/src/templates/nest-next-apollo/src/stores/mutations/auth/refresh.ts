import { gql } from '@apollo/client';

export type RefreshData = {
  refresh: {
    accessToken: string,
    refreshToken: string,
  },
};

export const REFRESH = gql`
  mutation Refresh {
    refresh {
      accessToken
      refreshToken
    }
  }
`;
