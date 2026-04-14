import { expect, test } from 'vitest';

import { escapeHtml, escapeJson } from './escape';

test('escapeHtml', () => {
  expect(escapeHtml('')).toStrictEqual('');
  expect(escapeHtml('foo&bar')).toEqual('foo\\u0026bar');
  expect(escapeHtml('foo>bar')).toEqual('foo\\u003ebar');
  expect(escapeHtml('foo<bar')).toEqual('foo\\u003cbar');
  expect(escapeHtml('foo\u2028bar')).toEqual('foo\\u2028bar');
  expect(escapeHtml('foo\u2029bar')).toEqual('foo\\u2029bar');
  expect(escapeHtml('no special chars')).toEqual('no special chars');
});

test('escapeJson', () => {
  expect(escapeJson('hello')).toEqual('"\\"hello\\""');
  expect(escapeJson({ a: 1 })).toEqual('"{\\"a\\":1}"');
  expect(escapeJson('<script>')).toEqual('"\\"\\u003cscript\\u003e\\""');
  expect(escapeJson(null)).toEqual('"null"');
  expect(escapeJson(42)).toEqual('"42"');
});
