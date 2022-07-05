import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { finished } from 'stream/promises';
import { GraphQLUpload } from 'graphql-upload';

import { Resolvers } from '@/graphql/client';

const uploadsDir = path.resolve('public/uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const resolvers: Resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (_, { file }) => {
      const upload = await file;

      const extname = path.extname(upload.filename);
      const filename = `${randomUUID()}${extname}`;

      const writeStream = fs.createWriteStream(path.join(uploadsDir, filename));

      upload.createReadStream().pipe(writeStream);

      await finished(writeStream);

      return {
        encoding: upload.filename,
        mimetype: upload.mimetype,
        filename,
        url: `/uploads/${filename}`,
      };
    },
  },
};

export default {
  typeDefs: fs.readFileSync(path.resolve(fileURLToPath(import.meta.url), '..', './schema.graphql'), 'utf-8'),
  resolvers,
};
