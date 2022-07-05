import { gql } from '@apollo/client';

import { USER } from '../../fragments/User';

export const FIND_ALL_USERS = gql`
  ${USER}

  query FindAllUsers($search: String, $page: Int, $size: Int) {
    findAllUsers(search: $search, page: $page, size: $size) {
      users {
        ...User
      }
      total
    }
  }
`;
