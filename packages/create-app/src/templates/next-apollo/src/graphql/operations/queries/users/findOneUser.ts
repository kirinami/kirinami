import { gql } from '@apollo/client';

import { USER } from '../../fragments/User';

export const FIND_ONE_USER = gql`
  ${USER}

  query FindOneUser($id: Int) {
    findOneUser(id: $id) {
      ...User
    }
  }
`;
