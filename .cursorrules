# Security Rules for AI-Generated Apps

This project follows the strict security guidelines below. Do not deviate from these rules under any circumstances.

## 1. Secrets and Environment Variables
- Never expose raw secret values in frontend or client-side files.
- All secrets (API keys, private tokens) must reside in `.env` (ignored by git) and be accessed via `process.env`.
- Generate `.env.example` templates with empty placeholders.

## 2. Rate Limiting
- Apply rate limiting on all API routes.
- Auth endpoints: 5 requests per 15 minutes per IP.
- General API routes: 60 requests per minute per IP.
- AI/LLM Proxy endpoints: 10 requests per minute per IP/user.
- Return `429 Too Many Requests` with a clear user message when limits are hit.

## 3. Input Validation and Sanitization
- Validate and sanitize all user input on the server before processing.
- Reject invalid inputs with `400 Bad Request`.
- Limit allowed characters, types, and lengths of string inputs.

## 4. Authentication and Authorization (if applicable)
- Use established auth libraries.
- Passwords must be hashed using bcrypt (cost 12+) or argon2.
- JWT secrets must be strong and stored securely in environment variables.

## 5. SQL and Database Security (if applicable)
- Always use parameterized queries or an ORM.
- Never concatenate user input to form raw database queries.

## 6. CORS Configuration
- Never use wildcard CORS (`*`) in production.
- Whitelist only explicitly allowed origins.

## 7. HTTP Security Headers
- Set standard security headers using `helmet` (or equivalent middleware).
- Restrict frame loading (`X-Frame-Options: DENY`), prevent MIME sniffing, and set Referrer-Policy.
- Hide frame details (`X-Powered-By`).

## 8. File Upload Security (if applicable)
- Validate MIME type, extension, and file size on the server.
- Rename files using a UUID; never trust user-provided filenames.

## 9. Error Handling and Logging
- Never return stack traces or raw database/system errors to the client.
- Return generic error messages to the user ("Something went wrong") and log detailed errors on the server.

## 10. Dependency Security
- Pin dependency versions in package manifests and lock files.
- Audit dependencies using standard scanner tools regularly.

## 11. XSS Prevention
- Never render user-supplied or model-generated inputs directly using unsafe DOM rendering (`innerHTML` or `dangerouslySetInnerHTML`) without scrubbing.
- Use `textContent`, `document.createElement`, or robust sanitization libraries.

## 12. AI and LLM-Specific Rules
- Treat LLM inputs and outputs as untrusted data.
- Set `maxOutputTokens` or token budgets to prevent cost runaway.
- Keep keys server-side only; route queries through backend API endpoints.
