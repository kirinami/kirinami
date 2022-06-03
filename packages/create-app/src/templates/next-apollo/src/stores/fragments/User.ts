import { gql } from '@apollo/client';

export type User = {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
};

export const USER = gql`
  fragment User on User {
    id
    firstName
    lastName
    email
  }
`;
