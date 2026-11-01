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

module.exports = { createUploadFilename, uploadLimits };
