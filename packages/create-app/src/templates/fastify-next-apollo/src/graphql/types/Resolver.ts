import { ISchemaLevelResolver } from '@graphql-tools/utils';

import Context from './Context';

type Resolver<Source, Args, Return> = ISchemaLevelResolver<Source, Context, Args, Promise<Return>>;

export default Resolver;
