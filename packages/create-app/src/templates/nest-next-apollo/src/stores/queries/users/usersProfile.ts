import { gql } from '@apollo/client';

import { USER, User } from '../../fragments/User';

export type UsersProfileQuery = {
  user: User,
};

export const USERS_PROFILE_QUERY = gql`
  ${USER}

  query UsersProfile {
    user: usersProfile {
      ...User
    }
  }
`;
