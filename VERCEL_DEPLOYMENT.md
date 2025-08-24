# Vercel Deployment Guide

## Quick Deploy

### Option 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel

# Or deploy directly to production
vercel --prod
```

### Option 2: Deploy with npx (no installation needed)

```bash
# Deploy without installing Vercel CLI
npx vercel

# Deploy to production
npx vercel --prod
```

### Option 3: Deploy via GitHub Integration

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Import your repository
5. Vercel will auto-detect settings and deploy

## First-Time Deployment Steps

1. **Run the deployment command:**

   ```bash
   npx vercel
   ```

2. **Follow the prompts:**

   ```
   ? Set up and deploy "~/apps/json-fields"? [Y/n] Y
   ? Which scope do you want to deploy to? Your-Username
   ? Link to existing project? [y/N] N
   ? What's your project's name? json-fields
   ? In which directory is your code located? ./
   ```

3. **Vercel will:**
   - Auto-detect framework (Vite)
   - Install dependencies
   - Run build command
   - Deploy to a preview URL

4. **Deploy to production:**
   ```bash
   npx vercel --prod
   ```

## Configuration Details

### vercel.json Configuration

The project includes a `vercel.json` with:

- ✅ Security headers (XSS, Frame Options, etc.)
- ✅ Cache control for assets
- ✅ Clean URLs
- ✅ SPA routing support
- ✅ Build configuration

### Environment Variables

If you need environment variables:

1. **Via Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add your variables
   - Redeploy

2. **Via CLI:**
   ```bash
   vercel env add VITE_API_URL
   ```

### Build Settings

- **Framework Preset:** Vite
- **Build Command:** `npm run build` or `npm run vercel-build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Custom Domain

### Add a custom domain:

1. **Via Dashboard:**
   - Go to Project Settings → Domains
   - Add your domain
   - Follow DNS configuration

2. **Via CLI:**
   ```bash
   vercel domains add your-domain.com
   ```

## Deployment Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy with specific environment
vercel --env preview
vercel --env production

# Force new deployment
vercel --force

# Deploy specific branch
vercel --scope your-team

# List all deployments
vercel ls

# Inspect deployment
vercel inspect [url]

# View logs
vercel logs [url]

# Remove deployment
vercel rm [deployment-id]
```

## GitHub Integration

### Automatic Deployments:

1. Connect GitHub repository in Vercel Dashboard
2. Configure:
   - **Production Branch:** `main` or `master`
   - **Preview Branches:** All other branches
   - **Auto-deploy:** Enabled

### Preview Deployments:

- Every push to non-production branches creates a preview
- Comment on PR with preview URL
- Automatic HTTPS

## Performance Features

Vercel automatically provides:

- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ HTTP/2 & HTTP/3
- ✅ Brotli compression
- ✅ Image optimization
- ✅ Edge caching

## Monitoring

### Analytics:

```bash
# Enable Web Vitals
vercel analytics enable
```

### View in Dashboard:

- Real User Metrics
- Core Web Vitals
- Performance scores

## Troubleshooting

### Build Fails:

```bash
# Check build logs
vercel logs

# Clear cache and redeploy
vercel --force

# Run build locally
npm run build
```

### 404 Errors on Routes:

- `vercel.json` includes SPA rewrite rules
- Check if file exists: `/index.html`

### Environment Variables Not Working:

```bash
# List environment variables
vercel env ls

# Pull to local .env
vercel env pull
```

## Rollback

### Via Dashboard:

1. Go to Deployments tab
2. Find previous deployment
3. Click "..." → "Promote to Production"

### Via CLI:

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

## Aliases

### Create custom aliases:

```bash
# Add alias to deployment
vercel alias [deployment-url] [alias]

# Example
vercel alias json-fields-ten.vercel.app json-fields-ten.vercel.app

# Remove alias
vercel alias rm [alias]
```

## Team Deployment

### Deploy to team account:

```bash
# Switch to team scope
vercel switch [team-name]

# Deploy to team
vercel --scope [team-name]
```

## Security Notes

- Never commit `.vercel` folder
- Use environment variables for secrets
- Enable Vercel Authentication for preview deployments
- Set up deployment protection for production

## Costs

### Free Tier Includes:

- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Preview deployments

### Monitor Usage:

```bash
# Check usage
vercel billing
```

## CI/CD Integration

### GitHub Actions:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Status Page](https://vercel-status.com)

---

Ready to deploy? Run: `npx vercel --prod`
