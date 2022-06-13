import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { finished } from 'stream/promises';
import { GraphQLUpload } from 'graphql-upload';

import resolver, { Context } from '../../resolver';

import { UploadArgs } from './types';

const uploadsDir = path.resolve('public/uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: resolver<unknown, Context, UploadArgs>(async (_, { file }) => {
      const upload = await file;

      const extname = path.extname(upload.filename);
      const filename = `${crypto.randomUUID()}${extname}`;

      const writeStream = fs.createWriteStream(path.join(uploadsDir, filename));

      upload.createReadStream()
        .pipe(writeStream);

      await finished(writeStream);

      return {
        encoding: upload.filename,
        mimetype: upload.mimetype,
        filename,
        url: `/uploads/${filename}`,
      };
    }),
  },
};

export default resolvers;
