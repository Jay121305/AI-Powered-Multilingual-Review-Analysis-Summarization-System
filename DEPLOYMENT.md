# AI Product Analyzer - Deployment Checklist

## Prerequisites
- [ ] Node.js v16+ installed
- [ ] npm or yarn installed
- [ ] Git installed (optional)

## Setup Steps
- [ ] Copy/clone project to target device
- [ ] Navigate to project directory
- [ ] Run `npm install`
- [ ] Verify API key is configured
- [ ] Run `npm run dev`
- [ ] Access http://localhost:3000

## Verification
- [ ] App loads without errors
- [ ] Search functionality works
- [ ] Language selection works
- [ ] Results display properly
- [ ] No console errors

## Troubleshooting
### Common Issues:
1. **Port 3000 already in use**: Change port in vite.config.ts
2. **API key errors**: Check geminiService.ts for correct API key
3. **Module not found**: Run `npm install` again
4. **Build errors**: Check Node.js version compatibility

### Quick Fixes:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use different package manager
yarn install
# or
pnpm install
```

## Production Deployment
- [ ] Run `npm run build`
- [ ] Test build with `npm run preview`
- [ ] Deploy dist/ folder to web server
- [ ] Configure environment variables
- [ ] Set up HTTPS
- [ ] Configure domain/subdomain