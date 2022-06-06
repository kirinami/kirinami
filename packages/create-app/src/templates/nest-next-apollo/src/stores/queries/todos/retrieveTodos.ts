import { gql } from '@apollo/client';

import { TODO, Todo } from '../../fragments/Todo';

export type RetrieveTodosVars = {
  my?: boolean,
  page?: number,
  size?: number,
};

export type RetrieveTodosData = {
  retrieveTodos: {
    todos: Todo[],
    total: number,
  },
};

export const RETRIEVE_TODOS = gql`
  ${TODO}

  query RetrieveTodos($my: Boolean, $page: Int, $size: Int) {
    retrieveTodos(my: $my, page: $page, size: $size) {
      todos {
        ...Todo
      }
      total
    }
  }
`;
