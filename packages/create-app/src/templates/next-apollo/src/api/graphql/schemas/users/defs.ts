import { gql } from 'apollo-server-micro';

const defs = gql`
  input CreateUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    roles: [String!]
  }

  input UpdateUserInput {
    email: String
    password: String
    firstName: String
    lastName: String
    roles: [String!]
  }

  type User {
    id: Int!
    email: String!
    firstName: String!
    lastName: String!
    roles: [String!]!
    accessToken: String
    refreshToken: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type UserPagination {
    users: [User!]!
    total: Int
  }

  type Query {
    findAllUsers(search: String, page: Int = 1, size: Int = 10): UserPagination!
    findOneUser(id: Int): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: Int!, input: UpdateUserInput!): User!
    deleteUser(id: Int!): User!
  }
`;

export default defs;
