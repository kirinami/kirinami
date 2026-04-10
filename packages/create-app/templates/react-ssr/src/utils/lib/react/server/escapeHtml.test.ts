import { expect, test } from 'vitest';

import { escapeHtml } from './escapeHtml';

test('escapeHtml', () => {
  expect(escapeHtml('')).toStrictEqual('');
  expect(escapeHtml('foo&bar')).toEqual('foo\\u0026bar');
  expect(escapeHtml('foo>bar')).toEqual('foo\\u003ebar');
  expect(escapeHtml('foo<bar')).toEqual('foo\\u003cbar');
  expect(escapeHtml('foo<bar')).toEqual('foo\\u003cbar');
  expect(escapeHtml('foo\u2028bar')).toEqual('foo\\u2028bar');
  expect(escapeHtml('foo\u2029bar')).toEqual('foo\\u2029bar');
});
