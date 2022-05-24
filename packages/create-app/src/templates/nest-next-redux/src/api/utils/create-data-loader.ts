import DataLoader from 'dataloader';

type Key = number | { id: number, args: unknown[] };

type FindByIds<Input, Returned> = (ids: Input[]) => Promise<Record<number | string, Returned>>;

const dataLoaderMap = new Map();

export function createDataLoader<Input extends Key, Returned>(
  key: string,
  findByIds: FindByIds<Input, Returned>,
  defaultValue: Returned,
) {
  let dataLoader = dataLoaderMap.get(key);
  if (dataLoader == null) {
    dataLoader = new DataLoader<Input, Returned>(async (keys) => {
      const data = await findByIds(keys as Input[]);
      return keys.map((key) => {
        const id = typeof key === 'number' ? key : key.id;
        return data[id] || defaultValue;
      });
    }, { cache: false });
    dataLoaderMap.set(key, dataLoader);
  }
  return dataLoader as DataLoader<Input, Returned>;
}
