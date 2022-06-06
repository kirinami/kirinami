import { gql } from '@apollo/client';

import { TODO, Todo } from '../../fragments/Todo';

export type RemoveTodoVars = {
  id: number,
};

export type RemoveTodoData = {
  removeTodo: Todo,
};

export const REMOVE_TODO = gql`
  ${TODO}

  mutation RemoveTodo($id: Int!) {
    removeTodo(id: $id) {
      ...Todo
    }
  }
`;
