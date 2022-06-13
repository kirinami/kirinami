import { FileUpload, GraphQLUpload } from 'graphql-upload';

import resolver, { Context } from '../../resolver';

type UploadArgs = {
  file: Promise<FileUpload>,
};

const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: resolver<unknown, Context, UploadArgs>(async (_, { file, ...args }) => {
      const { filename, mimetype, encoding, ...rest } = await file;

      // Do work 💪
      console.log({ args }, { filename, mimetype, encoding, rest });

      return { filename, mimetype, encoding, url: '' };
    }),
  },
};

export default resolvers;
