import { gql } from '@apollo/client';

export const TODO = gql`
  fragment Todo on Todo {
    id
    title
    completed
  }
`;
