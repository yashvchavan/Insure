# Cookie Troubleshooting Guide

This guide helps you diagnose and fix cookie issues in production deployment.

## Common Cookie Issues in Production

### 1. Cookies Not Being Set

**Symptoms:**
- Login appears successful but user gets redirected back to login
- No cookies visible in browser developer tools
- Authentication state not persisting

**Causes:**
- Incorrect domain configuration
- HTTPS/HTTP mismatch
- SameSite policy issues
- Missing environment variables

### 2. Cookies Being Set But Not Read

**Symptoms:**
- Cookies visible in browser but not accessible to application
- Authentication failing despite cookies being present

**Causes:**
- HttpOnly flag conflicts
- Path restrictions
- Domain restrictions

## Debugging Steps

### Step 1: Check Environment Variables

Ensure these are set correctly in your production environment:

```bash
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
JWT_SECRET=your-secret-key
```

### Step 2: Test Cookie Setting

Visit your debug endpoint to check cookie functionality:
```
https://your-domain.com/api/debug-cookies
```

This will show:
- Current cookies
- Request headers
- Environment variables
- Test cookie setting

### Step 3: Check Browser Developer Tools

1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Check Cookies section
4. Look for your domain
5. Verify cookies are present and have correct attributes

### Step 4: Verify HTTPS

Ensure your production site uses HTTPS:
- Cookies with `Secure` flag only work over HTTPS
- Mixed content can cause issues

## Platform-Specific Solutions

### Vercel

1. **Environment Variables:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required variables
   - Redeploy after adding variables

2. **Domain Configuration:**
   - Ensure custom domain is properly configured
   - Check SSL certificate is active

3. **Function Configuration:**
   - Vercel functions have timeout limits
   - Ensure your login function completes within limits

### Netlify

1. **Redirects:**
   - Create `_redirects` file in `public/`:
   ```
   /*    /index.html   200
   ```

2. **Environment Variables:**
   - Set in Netlify dashboard
   - Redeploy after changes

### Railway

1. **Environment Variables:**
   - Set in Railway dashboard
   - Variables are automatically available

2. **Domain:**
   - Railway provides HTTPS by default
   - Use provided domain or configure custom domain

## Quick Fixes

### Fix 1: Update Cookie Configuration

The login API has been updated with better cookie handling:

```typescript
const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction && !isLocalhost,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
  sameSite: 'lax', // Better compatibility
};
```

### Fix 2: Check SameSite Policy

Modern browsers are strict about SameSite:
- Use `SameSite=Lax` for better compatibility
- Avoid `SameSite=Strict` unless necessary

### Fix 3: Domain Configuration

For most deployments, let the browser set the domain automatically:
```typescript
// Don't set domain unless you have a specific subdomain setup
domain: undefined
```

## Testing Checklist

- [ ] Environment variables set correctly
- [ ] HTTPS enabled in production
- [ ] Debug endpoint working (`/api/debug-cookies`)
- [ ] Cookies visible in browser developer tools
- [ ] Login flow completes without errors
- [ ] Authentication persists after page refresh
- [ ] Logout properly clears cookies

## Common Error Messages

### "Cookies are blocked or not supported"
- Check if third-party cookies are enabled
- Verify SameSite policy
- Check browser privacy settings

### "Secure cookie in non-secure context"
- Ensure HTTPS is enabled
- Check if `Secure` flag is set correctly

### "Cookie domain mismatch"
- Remove explicit domain setting
- Let browser handle domain automatically

## Still Having Issues?

1. Check the debug endpoint output
2. Review browser console for errors
3. Verify all environment variables
4. Test with different browsers
5. Check if issue is browser-specific

## Support

If you're still experiencing issues:
1. Check the debug endpoint output
2. Review browser developer tools
3. Verify environment variables
4. Test with incognito/private browsing mode 