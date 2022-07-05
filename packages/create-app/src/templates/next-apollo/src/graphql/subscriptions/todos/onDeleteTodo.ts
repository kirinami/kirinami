import { gql } from '@apollo/client';

import { TODO } from '../../fragments/Todo';

export const ON_DELETE_TODO = gql`
  ${TODO}

  subscription OnDeleteTodo {
    onDeleteTodo {
      ...Todo
    }
  }
`;
