# Security Guide for Slane

## Environment Variables Security

### What Are Environment Variables?
Environment variables are configuration values that are set outside your code. They allow you to:
- Keep sensitive data out of your source code
- Use different values for development, staging, and production
- Share code publicly without exposing secrets

### Types of Environment Variables in Slane

#### 1. Public Environment Variables (Frontend)
These start with `VITE_` and are **safe to expose** in your frontend bundle:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Why they're safe**:
- Supabase anon keys are designed to be public
- They're protected by Row Level Security (RLS) policies
- They only allow operations you've explicitly permitted

#### 2. Private Environment Variables (Backend)
These should **NEVER** be exposed in frontend code:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
```

## Where to Store Environment Variables

### 1. Local Development
**File**: `.env` in your project root

```env
# .env (this file should be in .gitignore)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Security checklist**:
- ✅ Add `.env` to `.gitignore`
- ✅ Never commit `.env` to version control
- ✅ Use `.env.example` for documentation
- ✅ Use different values for different environments

### 2. Production Deployment

#### Netlify
1. Dashboard → Site Settings → Environment Variables
2. Add each variable individually
3. Deploy triggers automatically when you change variables

#### Vercel
1. Dashboard → Project Settings → Environment Variables
2. Set different values for Preview and Production
3. Redeploy after changing variables

#### Other Platforms
- **Railway**: Environment tab in project dashboard
- **Render**: Environment tab in service settings
- **Heroku**: Settings → Config Vars

## Security Best Practices

### ✅ DO:
1. **Use different keys for different environments**
   - Development: One Supabase project
   - Production: Separate Supabase project

2. **Rotate keys regularly**
   - Generate new anon keys monthly
   - Update all deployments when rotating

3. **Monitor usage**
   - Check Supabase dashboard for unusual activity
   - Set up usage alerts

4. **Use RLS policies**
   - Never rely on client-side security alone
   - Test your policies thoroughly

### ❌ DON'T:
1. **Never commit secrets to Git**
   ```bash
   # Bad - this will expose your keys
   git add .env
   git commit -m "Add environment variables"
   ```

2. **Never use service_role key in frontend**
   ```javascript
   // Bad - this bypasses all security
   const supabase = createClient(url, SERVICE_ROLE_KEY)
   ```

3. **Never hardcode secrets in code**
   ```javascript
   // Bad - this exposes your key in source code
   const SUPABASE_URL = "https://abc123.supabase.co"
   ```

## Row Level Security (RLS) Explained

RLS is your main security layer. It ensures users can only access their own data:

```sql
-- Users can only see their own tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

**How it works**:
1. User signs in with email/password
2. Supabase generates a JWT token
3. Token contains user ID
4. RLS policies check `auth.uid() = user_id`
5. Database only returns matching rows

## Emergency Response

### If Keys Are Compromised:
1. **Immediately rotate keys** in Supabase dashboard
2. **Update all deployments** with new keys
3. **Check access logs** for suspicious activity
4. **Review RLS policies** for any gaps

### If Database Is Compromised:
1. **Change database password** immediately
2. **Review all user accounts** for unauthorized access
3. **Check audit logs** in Supabase
4. **Consider migrating** to new project if severely compromised

## Monitoring and Alerts

### Set Up Monitoring:
1. **Supabase Dashboard**: Check daily active users, API requests
2. **Usage Alerts**: Set limits on API calls, storage, bandwidth
3. **Error Tracking**: Monitor authentication failures
4. **Regular Audits**: Review user accounts and permissions monthly

### Red Flags to Watch For:
- Sudden spike in API requests
- Authentication attempts from unusual locations
- New user registrations from suspicious emails
- Unusual data access patterns