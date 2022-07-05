import { gql } from '@apollo/client';

import { TODO } from '../../fragments/Todo';

export const FIND_ALL_TODOS = gql`
  ${TODO}

  query FindAllTodos($my: Boolean, $page: Int, $size: Int) {
    findAllTodos(my: $my, page: $page, size: $size) {
      todos {
        ...Todo
      }
      total
    }
  }
`;
