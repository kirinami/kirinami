import { gql } from '@apollo/client';

import { USER, User } from '../../fragments/User';

export type RetrieveUsersVars = {
  page?: number,
  size?: number,
};

export type RetrieveUsersData = {
  retrieveUsers: {
    users: User[],
    total: number,
  },
};

export const RETRIEVE_USERS = gql`
  ${USER}

  query RetrieveUsers($page: Int, $size: Int) {
    retrieveUsers(page: $page, size: $size) {
      users {
        ...User
      }
      total
    }
  }
`;
