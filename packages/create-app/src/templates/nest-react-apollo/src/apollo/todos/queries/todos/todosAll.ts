import { gql } from '@apollo/client';

import { TODO, Todo } from '../../fragments/Todo';

export type TodosAllQuery = {
  todos: Todo[],
};

export const TODOS_ALL_QUERY = gql`
  ${TODO}

  query TodosAll {
    todos: todosAll {
      ...Todo
    }
  }
`;
