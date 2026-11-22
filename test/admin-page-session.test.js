const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const ejs = require('ejs');

const templatePath = path.join(__dirname, '..', 'views', 'admin.html');
const sections = [
  { heading: 'Example heading', paragraph: 'Example paragraph', image: null },
];
const contentData = {
  home: sections,
  about: sections,
  services: sections,
  products: sections,
  clients: sections,
  contact: sections,
  backgroundColor: '#0d1b2a',
  backgroundImage: null,
};

async function renderAdminPage(isAuthenticated) {
  return ejs.renderFile(templatePath, {
    content: contentData,
    csrfToken: 'a'.repeat(64),
    isAuthenticated,
  });
}

test('renders the login form for an unauthenticated session', async () => {
  const html = await renderAdminPage(false);

  assert.match(html, /id="login-section" style="display: block;"/);
  assert.match(html, /id="admin-section" style="display: none;"/);
});

test('restores the admin panel for an authenticated session after reload', async () => {
  const html = await renderAdminPage(true);

  assert.match(html, /id="login-section" style="display: none;"/);
  assert.match(html, /id="admin-section" style="display: block;"/);
});
