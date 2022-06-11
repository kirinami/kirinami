import { gql } from '@apollo/client';

import { FindAllUsersArgs } from '@/api/graphql/schemas/users/types';

import { USER, User } from '../../fragments/User';

export type FindAllUsersVars = FindAllUsersArgs;

export type FindAllUsersData = {
  findAllUsers: {
    users: User[],
    total: number,
  },
};

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
