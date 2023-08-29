import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { FastifyPluginAsync } from 'fastify';
import mime from 'mime';

declare module 'fastify' {
  interface FastifyReply {
    sendFile: (link: string) => Promise<void>;
  }
}

const skipOverride = Symbol.for('skip-override');

export const staticPlugin: FastifyPluginAsync & { [skipOverride]?: boolean } = async (app) => {
  const rootDir = process.cwd();
  const buildSpaDir = path.resolve(rootDir, '.build/spa');
  const publicDir = path.resolve(rootDir, 'public');

  app.decorateReply('sendFile', async function sendFile(link) {
    const extname = path.extname(link);

    if (!extname || extname === '.') {
      throw new Error('Unsupported file extension');
    }

    const buildSpaFile = path.join(buildSpaDir, link);
    const publicFile = path.join(publicDir, link);

    const { file, stat } = await fs
      .stat(publicFile)
      .then((publicStat) => ({
        file: publicFile,
        stat: publicStat,
      }))
      .catch(() =>
        fs.stat(buildSpaFile).then((spaStat) => ({
          file: buildSpaFile,
          stat: spaStat,
        })),
      );

    const content = await fs.readFile(file);

    return this.status(200)
      .headers({
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=0',
        'Content-Length': stat.size,
        'Content-Type': mime.getType(file) || 'application/octet-stream',
        ETag: `W/"${stat.size.toString(16)}-${stat.mtime.getTime().toString(16)}"`,
        'Last-Modified': stat.mtime.toUTCString(),
      })
      .send(content);
  });
};

staticPlugin[skipOverride] = true;
