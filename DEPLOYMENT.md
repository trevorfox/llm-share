# CDN Deployment Guide

This guide explains how to deploy the widget to Vercel CDN and connect your Squarespace domain.

## Prerequisites

1. Vercel account (free tier works)
2. GitHub repository connected to Vercel
3. Domain on Squarespace (or any DNS provider)

## Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository (`llm-share`)
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

5. Click "Deploy"

## Step 2: Get Vercel Credentials for GitHub Actions

After your first deployment, you'll need these for GitHub Actions:

### Get Vercel Token
1. Go to Vercel Dashboard → Settings → Tokens
2. Create a new token (name it "GitHub Actions")
3. Copy the token

### Get Vercel Org ID
1. Go to Vercel Dashboard → Settings → General
2. Copy your "Team ID" (this is your org ID)

### Get Vercel Project ID
1. Go to your project in Vercel
2. Go to Settings → General
3. Copy the "Project ID"

## Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - `VERCEL_TOKEN` - Your Vercel token from Step 2
   - `VERCEL_ORG_ID` - Your Team ID from Step 2
   - `VERCEL_WIDGET_PROJECT_ID` - Your Project ID from Step 2
   - `NPM_TOKEN` (optional) - Only if you want to publish to npm on tags

## Step 4: Connect Custom Domain (Squarespace)

### Option A: Subdomain (Recommended)
Use a subdomain like `cdn.yourdomain.com` or `widget.yourdomain.com`

1. **In Vercel:**
   - Go to your project → Settings → Domains
   - Add your subdomain: `cdn.yourdomain.com`
   - Vercel will show you DNS records to add

2. **In Squarespace:**
   - Go to Settings → Domains → Your Domain → DNS Settings
   - Add a CNAME record:
     - **Host**: `cdn` (or `widget`)
     - **Points to**: `cname.vercel-dns.com`
     - **TTL**: 3600 (or default)

   OR if Squarespace doesn't support CNAME at root:
   - Add an A record pointing to Vercel's IP (Vercel will show you the IP)
   - Or use Squarespace's "Connect External Domain" feature

### Option B: Using Squarespace's External Domain Feature
1. In Squarespace: Settings → Domains → Connect External Domain
2. Enter your subdomain (e.g., `cdn.yourdomain.com`)
3. Follow Squarespace's instructions to point to Vercel

### Option C: DNS Provider (If Squarespace doesn't support subdomains)
If Squarespace doesn't allow subdomain DNS management:
1. Use a DNS provider like Cloudflare (free)
2. Point your domain's nameservers to Cloudflare
3. Add CNAME record in Cloudflare pointing to Vercel

## Step 5: Update Loader Default URL

After your domain is connected, update the default widget URL in `src/loader.ts`:

```typescript
const widgetUrl =
  rawConfig.widgetUrl ||
  'https://cdn.yourdomain.com/widget.iife.js'; // Update this
```

Then rebuild and redeploy.

## Step 6: Verify Deployment

After deployment, test these URLs:
- `https://cdn.yourdomain.com/loader.js`
- `https://cdn.yourdomain.com/widget.iife.js`
- `https://cdn.yourdomain.com/widget.umd.js`
- `https://cdn.yourdomain.com/widget.es.js`

All should return JavaScript files with proper CORS headers.

## Testing Locally

Before deploying, test locally:

```bash
npm run build
npm run serve
# Visit http://localhost:8000/loader.js
```

## Automatic Deployments

Once set up:
- **Every push to `main`** → Auto-deploys to production
- **Git tags** (`v1.0.0`) → Deploys and optionally publishes to npm

## Troubleshooting

### Domain not resolving
- Wait 24-48 hours for DNS propagation
- Check DNS records match Vercel's requirements
- Verify domain is added in Vercel project settings

### CORS errors
- Verify `Access-Control-Allow-Origin: *` header is set (configured in `vercel.json`)

### 404 errors
- Ensure `dist/` folder contains built files
- Check `vercel.json` output directory matches your build output
- Verify file names match (loader.js, widget.*.js)

### Build fails
- Check Node.js version (should be 20)
- Verify all dependencies install correctly
- Check build logs in GitHub Actions

## Manual Deployment

If you need to deploy manually:

```bash
npm install -g vercel
vercel login
vercel --prod
```

## CDN URLs for Users

Once deployed, users can use:

```html
<script>
window.LLMShare = {
  mode: "hosted",
  // ... config
};
</script>
<script src="https://cdn.yourdomain.com/loader.js"></script>
```

Or override the widget URL:

```html
<script>
window.LLMShare = {
  widgetUrl: "https://cdn.yourdomain.com/widget.iife.js",
  // ... config
};
</script>
<script src="https://cdn.yourdomain.com/loader.js"></script>
```


