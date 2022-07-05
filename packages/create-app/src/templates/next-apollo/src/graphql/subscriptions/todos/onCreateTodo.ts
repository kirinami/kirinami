import { gql } from '@apollo/client';

import { TODO } from '../../fragments/Todo';

export const ON_CREATE_TODO = gql`
  ${TODO}

  subscription OnCreateTodo {
    onCreateTodo {
      ...Todo
    }
  }
`;
