import { gql } from '@apollo/client';

import { TODO, Todo } from '../../fragments/Todo';

export type TodosUpdateMutation = {
  todo: Todo,
};

export type TodosUpdateInput = {
  id: number,
  todo: {
    title?: string,
    completed?: boolean,
  },
};

export const TODOS_UPDATE_MUTATION = gql`
  ${TODO}

  mutation TodosUpdate($id: Float!, $todo: UpdateTodoInput!) {
    todo: todosUpdate(id: $id, todo: $todo) {
      ...Todo
    }
  }
`;
