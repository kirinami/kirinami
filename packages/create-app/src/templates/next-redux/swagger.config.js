const path = require('path');
const fs = require('fs');
const { generateApi } = require('swagger-typescript-api');

async function main() {
  const outputFile = path.resolve('./api/client/index.ts');

  await generateApi({
    url: `http://127.0.0.1:3000/swagger-json`,
    output: path.dirname(outputFile),
    name: path.basename(outputFile),
    cleanOutput: true,
    generateClient: true,
    httpClientType: 'fetch',
    extractRequestParams: true,
    extractRequestBody: true,
    extractResponseBody: true,
    extractResponseError: true,
    unwrapResponseData: true,
    patch: true,
    primitiveTypeConstructs: (constructs) => ({
      ...constructs,
    }),
  });

  fs.writeFileSync(
    outputFile,
    fs
      .readFileSync(outputFile, 'utf-8')
      // .replace(/(export type RequestParams) = (.+);/, `$1 = $2 & { headers?: Record<string, string> };`)
      // .replace(/private (baseApiParams: RequestParams)/, `public $1`)
      .replace(/export class (Api)/, `export class $1Client`)
  );
}

main()
  .catch(console.error)
  .finally(() => process.exit());
