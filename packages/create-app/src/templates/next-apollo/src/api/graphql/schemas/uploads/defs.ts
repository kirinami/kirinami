import { gql } from 'apollo-server-core';

const defs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  extend type Mutation {
    singleUpload(file: Upload!): File!
  }
`;

export default defs;
