import { gql } from 'apollo-server-micro';

const defs = gql`
  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  type Auth {
    accessToken: String
    refreshToken: String
  }

  type Mutation {
    login(input: LoginInput!): Auth!
    register(input: RegisterInput!): Auth!
    refresh(token: String!): Auth!
  }
`;

export default defs;
