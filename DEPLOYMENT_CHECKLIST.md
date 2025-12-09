# Deployment Checklist

Use this checklist to ensure all deployment steps are completed successfully.

## Initial Setup

### GitHub Setup
- [ ] Create GitHub repository
- [ ] Push code to GitHub repository
- [ ] Verify all files are present in repository

### Firebase Setup
- [ ] Create Firebase project in console
- [ ] Install Firebase CLI (`npm install -g firebase-tools`)
- [ ] Login to Firebase (`firebase login`)
- [ ] Update `.firebaserc` with correct project ID
- [ ] Test local build (`npm run build`)
- [ ] Perform manual deployment test (`npm run deploy:firebase`)
- [ ] Verify deployment at Firebase Hosting URL

### Vercel Setup
- [ ] Create Vercel account
- [ ] Install Vercel CLI (`npm install -g vercel`)
- [ ] Login to Vercel (`vercel login`)
- [ ] Link project to Vercel (`vercel link`)
- [ ] Test local build (`npm run build`)
- [ ] Perform manual deployment test (`npm run deploy:vercel`)
- [ ] Verify deployment at Vercel URL

## GitHub Actions CI/CD Setup

### Firebase CI/CD Configuration
- [ ] Generate Firebase service account key
- [ ] Add `FIREBASE_SERVICE_ACCOUNT` secret to GitHub repository
- [ ] Add `FIREBASE_PROJECT_ID` secret to GitHub repository
- [ ] Push code to trigger workflow
- [ ] Verify workflow runs successfully in GitHub Actions tab
- [ ] Verify production deployment

### Vercel CI/CD Configuration
- [ ] Generate Vercel API token
- [ ] Run `vercel link` to get org and project IDs
- [ ] Add `VERCEL_TOKEN` secret to GitHub repository
- [ ] Add `VERCEL_ORG_ID` secret to GitHub repository
- [ ] Add `VERCEL_PROJECT_ID` secret to GitHub repository
- [ ] Push code to trigger workflow
- [ ] Verify workflow runs successfully in GitHub Actions tab
- [ ] Verify production deployment

## Testing

### Manual Testing
- [ ] Test Firebase Hosting URL in multiple browsers
- [ ] Test Vercel deployment URL in multiple browsers
- [ ] Verify all routes work correctly (SPA routing)
- [ ] Check static assets load properly
- [ ] Test on mobile devices
- [ ] Verify HTTPS is working

### PR Preview Deployments
- [ ] Create a test pull request
- [ ] Verify Firebase preview deployment is created
- [ ] Verify Vercel preview deployment is created
- [ ] Check preview URLs are commented on PR
- [ ] Test preview deployments
- [ ] Merge PR and verify production deployment

## Post-Deployment

### Monitoring
- [ ] Set up uptime monitoring (optional)
- [ ] Configure error tracking (optional)
- [ ] Set up analytics (optional)
- [ ] Monitor deployment logs in Firebase Console
- [ ] Monitor deployment logs in Vercel Dashboard

### Documentation
- [ ] Update README with live deployment URLs
- [ ] Document any custom domain setup
- [ ] Document environment variables (if any)
- [ ] Create runbook for common issues

### Custom Domain (Optional)
- [ ] Purchase/configure custom domain
- [ ] Add custom domain to Firebase Hosting
- [ ] Add custom domain to Vercel
- [ ] Update DNS records
- [ ] Wait for SSL certificate provisioning
- [ ] Test custom domain

## Ongoing Maintenance

### Regular Tasks
- [ ] Review deployment logs weekly
- [ ] Update dependencies monthly
- [ ] Test deployments after major changes
- [ ] Backup Firebase project settings
- [ ] Monitor GitHub Actions usage

### Security
- [ ] Rotate API tokens every 90 days
- [ ] Review GitHub repository secrets
- [ ] Update Firebase security rules (if using database)
- [ ] Check for security advisories
- [ ] Keep CLI tools updated

## Troubleshooting Reference

If you encounter issues, refer to the Troubleshooting section in [DEPLOY.md](./DEPLOY.md).

Common issues:
- Build failures - Check Node.js version
- Authentication errors - Re-run `firebase login` or `vercel login`
- Missing secrets - Verify all GitHub secrets are configured
- Deployment timeouts - Check Firebase/Vercel status pages
