# Slane

A minimal to-do app for founders and designers. Built with React, TypeScript, and Tailwind CSS.

## Environment Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (2-3 minutes)
3. Go to Settings > API in your Supabase dashboard
4. Copy your Project URL and anon/public key

### 2. Set Up Environment Variables

**For Local Development:**

1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

**For Production Deployment:**

### Vercel Deployment (Recommended)

1. **Connect Repository**: 
   - Go to [vercel.com](https://vercel.com) and import your GitHub repository
   - Vercel will automatically detect it's a Vite project

2. **Set Environment Variables**:
   - In your Vercel project dashboard, go to Settings > Environment Variables
   - Add these variables:
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

3. **Deploy**: 
   - Vercel will automatically build and deploy your app
   - Your app will be available at `https://your-project.vercel.app`

### Other Platforms

- **Netlify**: Site settings > Environment variables
- Add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables

### 3. Set Up Database

1. In your Supabase dashboard, go to SQL Editor
2. Run the migration file from `supabase/migrations/20250814151357_mellow_desert.sql`
3. This creates the tasks table and security policies

### 4. Security Notes

- ✅ The anon/public key is safe to use in frontend code
- ✅ It's protected by Row Level Security (RLS) policies
- ❌ Never use the service_role key in frontend code
- ❌ Never commit your `.env` file to version control

## Development

```bash
npm install
npm run dev
```

## Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/iamakchavan/slane)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account and import the repository
3. Add your Supabase environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Manual Deployment

```bash
# Build for production
npm run build

# Preview the build locally
npm run preview
```

The `dist` folder contains the production build ready for deployment.