const { timingSafeEqual } = require('crypto');

function isValidCsrfToken(expectedToken, providedToken) {
  if (typeof expectedToken !== 'string' || typeof providedToken !== 'string') {
    return false;
  }

  const expected = Buffer.from(expectedToken, 'utf8');
  const provided = Buffer.from(providedToken, 'utf8');
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

module.exports = { isValidCsrfToken };
