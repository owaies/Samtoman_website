# Samtoman Request Limits

The server limits JSON and URL-encoded request bodies to 1 MB. This keeps unexpectedly large browser submissions from being buffered indefinitely by the Express parser.

Static assets are served with a one-day cache lifetime and ETags enabled. These settings apply to files under `public/` and reduce repeat transfers for unchanged assets.

## Review guidance

When adding a new endpoint that accepts uploads or large text, define a route-specific limit instead of increasing the global parser limit. When changing static caching, confirm that HTML or administrative responses are not accidentally served with a long-lived asset cache policy.

## Release checks

- Send normal form submissions through the existing parser.
- Confirm oversized payloads fail before controller logic runs.
- Verify updated static files generate new validators or cache-busting URLs when required.
