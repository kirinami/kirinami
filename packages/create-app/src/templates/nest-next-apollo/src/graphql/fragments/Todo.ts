import { gql } from '@apollo/client';

export type Todo = {
  id: number,
  user: {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
  },
  title: string,
  completed: boolean,
};

export const TODO = gql`
  fragment Todo on TodoOutput {
    id
    user {
      id
      firstName
      lastName
      email
    }
    title
    completed
  }
`;
