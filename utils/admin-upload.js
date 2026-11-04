const { randomUUID } = require('crypto');
const path = require('path');

const uploadLimits = Object.freeze({
  fileSize: 5 * 1024 * 1024,
  files: 20,
  fields: 100,
  parts: 120,
  fieldNameSize: 100,
  fieldSize: 256 * 1024,
});

function createUploadFilename(originalname) {
  const extension = path.extname(typeof originalname === 'string' ? originalname : '').toLowerCase();
  return `${randomUUID()}${extension}`;
}

function hasSupportedImageSignature(buffer, extension) {
  if (!Buffer.isBuffer(buffer)) return false;

  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case '.png':
      return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case '.webp':
      return buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
    case '.gif':
      return buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6));
    default:
      return false;
  }
}

module.exports = { createUploadFilename, hasSupportedImageSignature, uploadLimits };
