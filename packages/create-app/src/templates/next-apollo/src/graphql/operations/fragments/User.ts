import { gql } from '@apollo/client';

export const USER = gql`
  fragment User on User {
    id
    firstName
    lastName
    email
    roles
  }
`;
