# Raymond Chats

A simple chat app built with Next.js + Supabase, ready to host on Vercel.

## Setup Instructions

1. Create a free project at [Supabase](https://supabase.com).

2. Copy your **Project URL** and **Anon Key** from Supabase → Settings → API.

3. Create a `.env.local` file in the root of this project with:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Go to Supabase → SQL Editor → paste contents of `supabase.sql` → run.

5. Install dependencies and run locally:

```
npm install
npm run dev
```

6. Push to GitHub → connect to Vercel → Deploy 🚀
