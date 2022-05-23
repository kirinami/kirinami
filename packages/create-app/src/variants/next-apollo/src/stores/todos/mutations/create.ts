import { gql } from '@apollo/client';

import { TODO, Todo } from '../fragments/todo';

export type CreateTodoData = {
  todo: Todo,
};

export type CreateTodoVars = {
  todo: {
    title: string,
    completed: boolean,
  },
};

export const CREATE_TODO = gql`
  ${TODO}

  mutation CreateTodo($todo: CreateTodoInput!) {
    todo: todosCreate(todo: $todo) {
      ...Todo
    }
  }
`;
