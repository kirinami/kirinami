import { gql } from '@apollo/client';

import { TODO, Todo } from '../../fragments/Todo';

export type CreateTodoVars = {
  input: {
    userId?: number,
    title: string,
    completed: boolean,
  },
};

export type CreateTodoData = {
  createTodo: Todo,
};

export const CREATE_TODO = gql`
  ${TODO}

  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      ...Todo
    }
  }
`;
