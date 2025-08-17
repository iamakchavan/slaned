# Supabase Setup Guide for Slane

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/Sign in with GitHub, Google, or email
4. Click "New Project"
5. Choose your organization
6. Fill in project details:
   - **Name**: `slane-tasks` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
7. Click "Create new project"
8. Wait 2-3 minutes for setup to complete

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll see two important values:

### Project URL
```
https://your-project-id.supabase.co
```

### API Keys
- **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
- **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (different long string)

**⚠️ IMPORTANT**: 
- Use the **anon/public key** for your frontend app
- **NEVER** use the service_role key in frontend code (it bypasses RLS)

## Step 3: Set Up Your Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the migration SQL from `supabase/migrations/20250814151357_mellow_desert.sql`
4. Click "Run" to create your tables and security policies

## Step 4: Configure Environment Variables

### For Local Development (.env file)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Netlify Deployment
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add these variables:
   - Key: `VITE_SUPABASE_URL`, Value: `https://your-project-id.supabase.co`
   - Key: `VITE_SUPABASE_ANON_KEY`, Value: `your-anon-key-here`

### For Vercel Deployment
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add the same variables as above

## Step 5: Test Your Connection

1. Start your development server: `npm run dev`
2. Try to sign up for a new account
3. If successful, you should be able to create tasks

## Security Notes

✅ **Safe to expose publicly**:
- Project URL
- anon/public key (protected by RLS policies)

❌ **NEVER expose publicly**:
- service_role key
- Database password
- JWT secret

## Troubleshooting

### "Missing Supabase environment variables" error
- Check that your `.env` file exists and has the correct variables
- Ensure variable names start with `VITE_` for Vite to include them
- Restart your dev server after adding environment variables

### "Invalid API key" error
- Double-check you're using the anon/public key, not service_role
- Ensure there are no extra spaces or characters in your key

### Authentication not working
- Verify your RLS policies are set up correctly
- Check that email confirmation is disabled in Supabase Auth settings