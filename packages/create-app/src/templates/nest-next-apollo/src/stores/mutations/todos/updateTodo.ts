import { gql } from '@apollo/client';

import { TODO, Todo } from '../../fragments/Todo';

export type UpdateTodoVars = {
  id: number,
  input: {
    userId?: number,
    title?: string,
    completed?: boolean,
  },
};

export type UpdateTodoData = {
  updateTodo: Todo,
};

export const UPDATE_TODO = gql`
  ${TODO}

  mutation UpdateTodo($id: Int!, $input: UpdateTodoInput!) {
    updateTodo(id: $id, input: $input) {
      ...Todo
    }
  }
`;
