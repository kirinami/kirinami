import { gql } from '@apollo/client';

import { TODO, Todo } from '../fragments/todo';

export type DeleteTodoData = {
  todo: Todo,
};

export type DeleteTodoVars = {
  id: number,
};

export const DELETE_TODO = gql`
  ${TODO}

  mutation DeleteTodo($id: Float!) {
    todo: todosDelete(id: $id) {
      ...Todo
    }
  }
`;
