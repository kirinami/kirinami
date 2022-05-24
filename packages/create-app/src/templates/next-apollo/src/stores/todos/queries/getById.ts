import { gql } from '@apollo/client';

import { TODO, Todo } from '../fragments/todo';

export type GetTodoByIdData = {
  todo: Todo,
};

export type GetTodoByIdVars = {
  id: number,
};

export const GET_TODO_BY_ID = gql`
  ${TODO}

  query GetTodoById($id: Float!) {
    todo: todosById(id: $id) {
      ...Todo
    }
  }
`;
