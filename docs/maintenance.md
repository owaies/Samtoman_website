# Website maintenance guide

## Content
Keep business names, contact details, service descriptions, and external links synchronized when content changes.

## UI
Check navigation, hero content, primary calls to action, and responsive sections after visual changes.

## Release verification
- Run the configured build.
- Check the production homepage.
- Verify navigation links.
- Test mobile and desktop layouts.
- Review the browser console for runtime errors.

## Admin credentials
- Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET` through the deployment environment.
- Do not add a default administrator password to `database.sql` or commit real credentials.
- After changing credentials, verify that the configured account can sign in and that an incorrect password is rejected.

