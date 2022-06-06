import { gql } from '@apollo/client';

import { TODO, Todo } from '../../fragments/Todo';

export type RetrieveTodoVars = {
  id: number,
};

export type RetrieveTodoData = {
  retrieveTodo: Todo,
};

export const RETRIEVE_TODO = gql`
  ${TODO}

  query RetrieveTodo($id: Int!) {
    retrieveTodo(id: $id) {
      ...Todo
    }
  }
`;
