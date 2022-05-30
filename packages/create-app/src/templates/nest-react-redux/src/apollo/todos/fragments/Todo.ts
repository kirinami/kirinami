import { gql } from '@apollo/client';

export type Todo = {
  id: number,
  title: string,
  completed: boolean,
};

export const TODO = gql`
  fragment Todo on Todo {
    id
    title
    completed
  }
`;
