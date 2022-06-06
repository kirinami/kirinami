import { gql } from '@apollo/client';

import { USER, User } from '../../fragments/User';

export type SearchUsersVars = {
  search: string,
};

export type SearchUsersData = {
  searchUsers: User[],
};

export const SEARCH_USERS = gql`
  ${USER}

  query SearchUsers($search: String!) {
    searchUsers(search: $search) {
      ...User
    }
  }
`;
