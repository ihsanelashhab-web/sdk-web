# SDKCraft Web

SDKCraft is a developer-facing web app for turning OpenAPI specs into SDKs, starter documentation, and API change reports.

## What It Does

- Generate SDK files from OpenAPI JSON or YAML.
- Support TypeScript, Python, Dart, Go, and Java targets.
- Preview generated files in the browser.
- Download a complete SDK ZIP.
- Generate starter API documentation.
- Compare two API versions for breaking changes.
- Optionally sign in with GitHub for SDK history and GitHub export.

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_BASE_URL=https://api-to-sdk-production.up.railway.app
```

Start the app:

```bash
npm start
```

Build for production:

```bash
npm run build
```

## Product Hunt Launch Notes

Recommended Product Hunt name:

```text
SDKCraft
```

Recommended tagline:

```text
Turn OpenAPI specs into production-ready SDKs
```

Recommended positioning:

```text
SDKCraft helps API teams turn OpenAPI specs into production-ready SDKs, starter docs, and API change reports from one browser-based workflow.
```

## Environment

The app reads Supabase credentials from environment variables. Do not hard-code keys in `src/supabase.ts`.

`REACT_APP_API_BASE_URL` is optional. If it is not set, the app uses the current Railway backend URL.

## Deployment Checklist

- Configure Supabase OAuth redirect URLs for the deployed domain.
- Set Vercel environment variables for Supabase and backend URL.
- Confirm the main generation flow works without signup.
- Confirm GitHub sign-in works on the production domain.
- Run `npm run build` before publishing launch screenshots.
