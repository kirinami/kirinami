import { gql } from '@apollo/client';

import { TODO, Todo } from '../fragments/todo';

export type GetTodosData = {
  todos: Todo[],
};

export type GetTodosVars = {};

export const GET_TODOS = gql`
  ${TODO}

  query GetTodos {
    todos: todosAll {
      ...Todo
    }
  }
`;

