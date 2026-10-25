# Samtoman Request Limits

The server limits JSON and URL-encoded request bodies to 1 MB. This keeps unexpectedly large browser submissions from being buffered indefinitely by the Express parser.

Admin image uploads are limited to 5 MB per file and 20 files per request. Each upload must use a supported extension and its matching declared MIME type: `.jpg`/`.jpeg` with `image/jpeg`, `.png` with `image/png`, `.webp` with `image/webp`, or `.gif` with `image/gif`. The MIME type is supplied by the client, so this check is a consistency filter, not cryptographic proof that the file contents are a valid image.

Static assets are served with a one-day cache lifetime and ETags enabled. These settings apply to files under `public/` and reduce repeat transfers for unchanged assets.

## Review guidance

When adding a new endpoint that accepts uploads or large text, define a route-specific limit instead of increasing the global parser limit. When changing static caching, confirm that HTML or administrative responses are not accidentally served with a long-lived asset cache policy.

## Release checks

- Send normal form submissions through the existing parser.
- Confirm oversized payloads fail before controller logic runs.
- Verify updated static files generate new validators or cache-busting URLs when required.
- Confirm a supported image extension with a matching MIME type is accepted.
- Confirm mismatched pairs such as an `.html` filename declared as `image/png` are rejected.
- Confirm the 5 MB per-file and 20-file limits remain enforced.
