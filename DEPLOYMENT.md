# Deployment Guide

This is a static React application that can be deployed to Cloudflare Workers or any static hosting platform. Users bring their own Replicate API keys via the web interface.

## Cloudflare Workers Deployment

### Prerequisites
- Node.js installed
- A Cloudflare account (free tier works!)

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Login to Cloudflare:**
   ```bash
   npx wrangler login
   ```
   This opens a browser to authenticate.

3. **Deploy:**
   ```bash
   npm run deploy
   ```

Your site will be live at: `https://image-editing-arena.<your-subdomain>.workers.dev`

### Update Deployment

To update your deployed site:
```bash
npm run deploy
```

### View Deployment

Check your deployment in the Cloudflare dashboard:
- Go to [dash.cloudflare.com](https://dash.cloudflare.com)
- Navigate to Workers & Pages
- Find your `image-editing-arena` deployment

## Cloudflare Pages (Alternative)

Cloudflare Pages offers more features like preview deployments and git integration.

### Deploy via CLI

```bash
npm run cf:deploy
```

### Deploy via Git Integration

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Connect your repository
4. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Deploy!

## Other Platforms

### Vercel

```bash
npm install -g vercel
npm run build
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages

1. Build the site:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your `gh-pages` branch

## Configuration

### Custom Domain

To use a custom domain with Cloudflare Workers:

1. Add your domain to Cloudflare
2. Go to Workers & Pages in the dashboard
3. Select your worker
4. Go to Settings > Triggers > Custom Domains
5. Add your domain

### Environment Notes

- **Worker + static assets** - The worker proxies Replicate API calls, static assets are served from dist/
- **API keys are client-side** - Users enter their own Replicate API keys
- **No CORS issues** - The worker makes server-side requests to Replicate, avoiding browser CORS restrictions
- **No secrets needed** - No server-side configuration required

## Troubleshooting

### Build fails

Clear cache and rebuild:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Deployment fails

Make sure you're logged in:
```bash
npx wrangler whoami
```

If not logged in:
```bash
npx wrangler login
```

### API issues

The app uses a Cloudflare Worker to proxy requests to the Replicate API. This avoids CORS issues since the worker makes server-side requests. The proxy endpoint is `/api/replicate/*` which forwards to `https://api.replicate.com/*`.

## Cost

- **Cloudflare Workers Free Tier:** 100,000 requests/day
- **Cloudflare Pages Free Tier:** Unlimited requests, 500 builds/month
- **User API costs:** Users pay for their own Replicate API usage with their keys

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Replicate API Docs](https://replicate.com/docs)

