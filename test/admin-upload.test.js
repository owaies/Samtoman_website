const assert = require('node:assert/strict');
const test = require('node:test');

const { createUploadFilename, hasSupportedImageSignature, uploadLimits } = require('../utils/admin-upload');

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

test('recognizes supported JPEG, PNG, WebP, and GIF file signatures', () => {
  const fixtures = [
    [Buffer.from([0xff, 0xd8, 0xff, 0x00]), '.jpg'],
    [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), '.png'],
    [Buffer.from('RIFF0000WEBP', 'ascii'), '.webp'],
    [Buffer.from('GIF89a', 'ascii'), '.gif'],
  ];

  for (const [buffer, extension] of fixtures) {
    assert.equal(hasSupportedImageSignature(buffer, extension), true, extension);
  }
});

test('rejects mismatched, truncated, unsupported, and non-buffer image data', () => {
  assert.equal(hasSupportedImageSignature(Buffer.from('not an image'), '.jpg'), false);
  assert.equal(hasSupportedImageSignature(Buffer.from([0xff, 0xd8]), '.jpg'), false);
  assert.equal(hasSupportedImageSignature(Buffer.from('GIF89a'), '.png'), false);
  assert.equal(hasSupportedImageSignature(Buffer.from('image'), '.svg'), false);
  assert.equal(hasSupportedImageSignature('not a buffer', '.jpg'), false);
});
