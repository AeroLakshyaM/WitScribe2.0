# WitScribe

WitScribe is a quiz and study app with AI-assisted quiz and notes features, Supabase authentication, user profiles, avatar uploads, and a community question board.

## Run locally

Requirements: Node.js 20 or newer and npm.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`. The Supabase URL and publishable key for this project are already in the local `.env` file.
3. In the Supabase Dashboard, open **SQL Editor**, run [`supabase/migrations/20261031000000_initial_schema.sql`](supabase/migrations/20261031000000_initial_schema.sql), then enable email authentication.
4. In Supabase **Authentication > URL Configuration**, set the local site URL to `http://localhost:5173` and allow that URL for redirects.
5. For the six-digit signup screen, set the **Confirm sign up** email template to include `{{ .Token }}`. The default confirmation link can also confirm accounts from email; the OTP screen requires the six-digit template.
6. Start the app with `npm run dev` and open the local URL printed by Vite.

Google sign-in is available in the app after enabling Google under **Authentication > Providers** and adding the provider credentials and callback URL in Supabase.

## Data and access rules

- The schema creates profiles, questions, likes, and comments, and applies row-level security so users can edit their own profile and remove their own posts/comments/likes.
- The migration creates a public `avatars` storage bucket with authenticated uploads restricted to each user's folder.
- The schema migration must be run in the Supabase project before these features can access data. Existing Firebase users and records are not copied automatically; import them separately if they need to be preserved.
- Supabase URL and publishable key are browser-safe and are configured locally through `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never place a Supabase secret/service-role key in the frontend.
- Gemini powers AI quiz generation and note assistance. `VITE_GEMINI_API_KEY` is included in the browser bundle by the current integration. Use only a restricted development key; move these requests behind a server endpoint before using a private production key.
- `.env` is local configuration and is excluded from Git. Use `.env.example` as the shareable template. Rotate credentials that were committed in the past.

## Main scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production frontend |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check source files with ESLint |
