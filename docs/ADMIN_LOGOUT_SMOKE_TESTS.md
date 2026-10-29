# Admin logout smoke tests

1. Sign in through the admin form and confirm the admin panel appears.
2. Click **Logout** and confirm the browser sends `POST /admin/logout`, not a GET request.
3. Confirm the response is HTTP 204 and the session cookie is cleared with the same security attributes used at login.
4. Confirm the admin panel hides and the login form returns after a successful response.
5. Simulate a failed logout request and confirm the UI keeps the admin panel visible and reports that logout did not complete.
6. After logout, submit an administrative save request and confirm it is redirected to the login flow because the session is no longer authenticated.
