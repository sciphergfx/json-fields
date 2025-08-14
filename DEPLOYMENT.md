# Deployment Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Build Process](#build-process)
- [Deployment Options](#deployment-options)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Monitoring](#monitoring)

## Prerequisites

- Node.js 20.12.0 or higher
- npm 10.5.0 or higher
- Git for version control

## Environment Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd jsonToTable

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your production settings:

```env
VITE_APP_ENVIRONMENT=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
# Add other production-specific settings
```

## Build Process

### Development Build

```bash
npm run dev
```

### Production Build

```bash
# Run linting
npm run lint

# Run tests (if available)
# npm run test

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The production build will be generated in the `dist` folder.

## Deployment Options

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

### 2. Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### 3. GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### 4. Docker

Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t json-tools .
docker run -p 80:80 json-tools
```

### 5. AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Performance Optimization

### 1. Enable Compression

For nginx, add to configuration:

```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
gzip_min_length 1000;
```

### 2. Cache Headers

Configure appropriate cache headers:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN Configuration

- Use CloudFlare, AWS CloudFront, or similar CDN
- Configure appropriate cache TTLs
- Enable automatic minification

### 4. Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ]
}
```

## Security Considerations

### 1. Content Security Policy

Add CSP headers to your server configuration:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;";
```

### 2. Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### 3. Environment Variables

- Never commit `.env` files with sensitive data
- Use environment-specific configurations
- Rotate secrets regularly

### 4. Input Validation

The application includes:

- JSON size validation (5MB limit by default)
- Input sanitization
- Depth validation for nested objects
- Safe number handling

## Monitoring

### 1. Error Tracking

Integrate error tracking service:

```javascript
// Example with Sentry
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_APP_ENVIRONMENT,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
})
```

### 2. Analytics

```javascript
// Example with Google Analytics
import ReactGA from 'react-ga4'

if (process.env.VITE_ENABLE_ANALYTICS === 'true') {
  ReactGA.initialize(process.env.VITE_GA_MEASUREMENT_ID)
}
```

### 3. Performance Monitoring

- Use Lighthouse CI for automated performance testing
- Monitor Core Web Vitals
- Set up alerts for performance degradation

### 4. Uptime Monitoring

- Use services like UptimeRobot, Pingdom, or StatusCake
- Set up alerts for downtime
- Monitor response times

## Health Check Endpoint

For containerized deployments, add a health check:

```javascript
// public/health.json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Rollback Strategy

1. Keep previous builds available
2. Use versioned deployments
3. Implement feature flags for gradual rollout
4. Have a rollback plan documented

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test both JSON to Table and JSON to Form features
- [ ] Check error handling works correctly
- [ ] Verify localStorage functionality
- [ ] Test on multiple browsers
- [ ] Check mobile responsiveness
- [ ] Verify CSP and security headers
- [ ] Test file export functionality
- [ ] Monitor error logs
- [ ] Check performance metrics

## Troubleshooting

### Common Issues

1. **Blank page after deployment**
   - Check console for errors
   - Verify base URL in vite.config.js
   - Check CSP headers

2. **localStorage not working**
   - Check browser privacy settings
   - Verify HTTPS is enabled
   - Check for browser extensions blocking storage

3. **Performance issues**
   - Check bundle size
   - Verify CDN is working
   - Check for memory leaks in browser DevTools

## Support

For issues or questions:

- Check the [README](README.md)
- Review error logs
- Open an issue on GitHub
