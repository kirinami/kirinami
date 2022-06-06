import { gql } from '@apollo/client';

import { USER, User } from '../../fragments/User';

export type RetrieveUserVars = {
  id?: number,
};

export type RetrieveUserData = {
  retrieveUser: User,
};

export const RETRIEVE_USER = gql`
  ${USER}

  query RetrieveUser($id: Int) {
    retrieveUser(id: $id) {
      ...User
    }
  }
`;
