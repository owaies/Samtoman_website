# Samtoman Admin Session

The Express application creates an `express-session` backed session boundary before mounting the application routes.

## Configuration

`SESSION_SECRET` is required through the environment. Production cookies use `httpOnly`, `sameSite: 'lax'`, and the `secure` flag when `NODE_ENV` is `production`.

## Route structure

`routes/index.js` contains public site routes. `routes/admin.js` contains the administrative surface. Changes to administrative behavior should preserve the session boundary rather than introducing ad-hoc browser storage for privileged state.

## CSRF protection

The admin page creates a cryptographically random token in the server-side session and exposes it in a page meta tag. The browser sends that value in the `X-CSRF-Token` header for login, logout, and content-save requests. Successful login regenerates the session and rotates the token; the new value is returned in the response header. Missing or mismatched tokens are rejected with HTTP 403 before upload processing begins.

Do not place CSRF tokens in URLs, log them, or accept them from form fields. Keep the token bound to the active session.

## Operational checks

- Set a unique session secret outside source control.
- Use HTTPS in production so secure cookies can be delivered.
- Keep body-size limits enabled.
- Do not log session identifiers, CSRF tokens, or credentials.
- Load the admin page and confirm its CSRF meta tag is populated.
- Confirm login rotates the token and the browser updates its stored value.
- Confirm logout and content-save requests include the current token.
- Confirm missing and incorrect tokens receive HTTP 403 and do not change content or write uploaded files.
- Confirm session loss returns the user to the login flow.
- After successful login, reload `/admin` and confirm the authenticated session still renders the admin panel without showing the login form.
- After logout, reload `/admin` and confirm the login form is shown again.
