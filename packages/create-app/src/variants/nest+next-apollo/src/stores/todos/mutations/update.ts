import { gql } from '@apollo/client';

import { TODO, Todo } from '../fragments/todo';

export type UpdateTodoData = {
  todo: Todo,
};

export type UpdateTodoVars = {
  id: number,
  todo: {
    title?: string,
    completed?: boolean,
  },
};

export const UPDATE_TODO = gql`
  ${TODO}

  mutation UpdateTodo($id: Float!, $todo: UpdateTodoInput!) {
    todo: todosUpdate(id: $id, todo: $todo) {
      ...Todo
    }
  }
`;
