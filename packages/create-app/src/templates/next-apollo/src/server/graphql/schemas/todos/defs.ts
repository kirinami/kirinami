import { gql } from 'apollo-server-core';

const defs = gql`
  input CreateTodoInput {
    userId: Int
    title: String!
    completed: Boolean!
  }

  input UpdateTodoInput {
    userId: Int
    title: String
    completed: Boolean
  }

  type Todo {
    id: Int!
    userId: Int!
    user: User!
    title: String!
    completed: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type TodoPagination {
    todos: [Todo!]!
    total: Int
  }

  extend type Query {
    findAllTodos(my: Boolean, page: Int = 1, size: Int = 10): TodoPagination!
    findOneTodo(id: Int!): Todo
  }

  extend type Mutation {
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(id: Int!, input: UpdateTodoInput!): Todo!
    deleteTodo(id: Int!): Todo!
  }

  extend type Subscription {
    todoCreated: Todo!
  }
`;

export default defs;
