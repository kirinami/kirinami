import { FileUpload } from 'graphql-upload';

export type UploadArgs = {
  file: Promise<FileUpload>,
};
