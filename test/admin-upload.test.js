const assert = require('node:assert/strict');
const test = require('node:test');

const { createUploadFilename, uploadLimits } = require('../utils/admin-upload');

test('admin upload filenames are unique and preserve only a lowercase extension', () => {
  const first = createUploadFilename('Campaign.PnG');
  const second = createUploadFilename('Campaign.PnG');

  assert.match(first, /^[0-9a-f-]{36}\.png$/);
  assert.match(second, /^[0-9a-f-]{36}\.png$/);
  assert.notEqual(first, second);
});

test('admin multipart uploads have bounded file, field, and part counts', () => {
  assert.deepEqual(uploadLimits, {
    fileSize: 5 * 1024 * 1024,
    files: 20,
    fields: 100,
    parts: 120,
    fieldNameSize: 100,
    fieldSize: 256 * 1024,
  });
});
