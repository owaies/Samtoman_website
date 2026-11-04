# Admin upload smoke tests

1. Sign in to the admin panel and upload two images with the same original filename in one save request.
2. Confirm both files are stored under different generated names and that the saved content references the correct image for each field.
3. Confirm the generated names retain only the lowercase file extension, not any client-supplied directory components.
4. Upload a file larger than 5 MiB and confirm Multer rejects it.
5. Submit more than 20 files, more than 100 text fields, or more than 120 total multipart parts and confirm the request is rejected.
6. Submit a field name longer than 100 characters or a text field larger than 256 KiB and confirm the request is rejected.
7. Confirm ordinary admin edits with fewer than the configured limits still save successfully.
8. Upload non-image bytes using a permitted image MIME type and matching extension; confirm the save is rejected and the uploaded files are removed.
9. Upload valid JPEG, PNG, WebP, and GIF files and confirm their file signatures match the accepted extension before content is saved.
