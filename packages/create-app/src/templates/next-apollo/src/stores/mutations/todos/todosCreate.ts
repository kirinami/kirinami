import { gql } from '@apollo/client';

import { TODO, Todo } from '../../fragments/Todo';

export type TodosCreateMutation = {
  todo: Todo,
};

export type TodosCreateInput = {
  todo: {
    title: string,
    completed: boolean,
  },
};

export const TODOS_CREATE_MUTATION = gql`
  ${TODO}

  mutation TodosCreate($todo: CreateTodoInput!) {
    todo: todosCreate(todo: $todo) {
      ...Todo
    }
  }
`;
