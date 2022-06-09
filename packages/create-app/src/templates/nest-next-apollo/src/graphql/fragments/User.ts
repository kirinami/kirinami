import { gql } from '@apollo/client';

import { Role } from '@/api/users/enums/role.enum';

export type User = {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  roles: Role[],
};

export const USER = gql`
  fragment User on UserOutput {
    id
    firstName
    lastName
    email
    roles
  }
`;
