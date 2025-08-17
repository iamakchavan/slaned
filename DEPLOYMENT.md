# Deployment Guide

## Pre-deployment Checklist

- [x] ✅ `.env` file is in `.gitignore`
- [x] ✅ Sensitive data removed from repository
- [x] ✅ `.env.example` file provided with instructions
- [x] ✅ `vercel.json` configuration added
- [x] ✅ Build scripts configured in `package.json`

## Environment Variables Required

Set these in your deployment platform (Vercel/Netlify):

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Vercel Deployment Steps

1. **Push to GitHub**: Make sure your code is pushed to GitHub
2. **Import to Vercel**: Go to [vercel.com](https://vercel.com) and import your repository
3. **Set Environment Variables**: Add the Supabase variables in Vercel dashboard
4. **Deploy**: Vercel will automatically build and deploy

## Build Commands

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Dev Command**: `npm run dev`

## Post-deployment

1. Test the deployed app
2. Verify Supabase connection works
3. Test user registration and login
4. Check that tasks can be created and managed

## Troubleshooting

### Common Issues

1. **White screen**: Check browser console for environment variable errors
2. **Supabase errors**: Verify environment variables are set correctly
3. **Build failures**: Check that all dependencies are in `package.json`

### Environment Variable Debugging

The app will show helpful error messages if Supabase is not configured properly. Check the browser console for detailed error information.