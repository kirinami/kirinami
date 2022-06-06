import { gql } from '@apollo/client';

export type Todo = {
  id: number,
  user: {
    id: number,
    firstName: string,
    lastName: string,
  },
  title: string,
  completed: boolean,
};

export const TODO = gql`
  fragment Todo on Todo {
    id
    user {
      id
      firstName
      lastName
    }
    title
    completed
  }
`;
