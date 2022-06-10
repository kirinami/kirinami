import { gql } from 'apollo-server-micro';

const defs = gql`
  input CreateTodoInput {
    userId: Int!
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

  type Query {
    getTodos: [Todo!]!
    getTodoBy(id: Int!): Todo
  }

  type Mutation {
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(id: Int!, input: UpdateTodoInput!): Todo!
    deleteTodo(id: Int!): Todo!
  }
`;

export default defs;
