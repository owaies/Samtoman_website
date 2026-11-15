const assert = require('node:assert/strict');
const test = require('node:test');

const { isValidCsrfToken } = require('../utils/admin-csrf');

test('accepts an exact CSRF token match', () => {
  const token = 'a'.repeat(64);
  assert.equal(isValidCsrfToken(token, token), true);
});

test('rejects missing and non-string CSRF tokens', () => {
  assert.equal(isValidCsrfToken(undefined, 'token'), false);
  assert.equal(isValidCsrfToken('token', undefined), false);
  assert.equal(isValidCsrfToken('token', ['token']), false);
});

test('rejects different tokens with equal lengths', () => {
  assert.equal(isValidCsrfToken('expected-token', 'attacker-token'), false);
});

test('rejects tokens with different byte lengths', () => {
  assert.equal(isValidCsrfToken('short', 'longer'), false);
});
