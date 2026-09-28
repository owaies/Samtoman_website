# Samtoman Admin Session

The Express application creates an `express-session` backed session boundary before mounting the application routes.

## Configuration

`SESSION_SECRET` is required through the environment. Production cookies use `httpOnly`, `sameSite: 'lax'`, and the `secure` flag when `NODE_ENV` is `production`.

## Route structure

`routes/index.js` contains public site routes. `routes/admin.js` contains the administrative surface. Changes to administrative behavior should preserve the session boundary rather than introducing ad-hoc browser storage for privileged state.

## Operational checks

- Set a unique session secret outside source control.
- Use HTTPS in production so secure cookies can be delivered.
- Keep body-size limits enabled.
- Do not log session identifiers or credentials.
- Treat session loss as an authentication event and return the user to the login flow.
