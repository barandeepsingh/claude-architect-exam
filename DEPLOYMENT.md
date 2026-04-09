# Deployment Guide — Claude Certified Architect Exam Portal

This guide walks you through deploying the exam portal to **Vercel** (free tier) in 5 minutes.

## Prerequisites

- **GitHub account** (free at [github.com](https://github.com))
- **Vercel account** (free at [vercel.com](https://vercel.com), sign up with GitHub)
- **Git installed** on your machine
- The `claude-architect-exam` code (already in your `/mnt/cca/claude-architect-exam/` folder)

## Step 1: Create a Private GitHub Repository

### 1a. Go to GitHub and Create a Repo

1. Log in to [github.com](https://github.com)
2. Click **+** (top right) → **New repository**
3. Fill in:
   - **Repository name**: `claude-architect-exam`
   - **Description**: "Claude Certified Architect mock test portal with adaptive learning"
   - **Visibility**: ⚪ **PRIVATE** (keep your study material private)
   - **Initialize with**: Leave unchecked (we already have files)
4. Click **Create repository**

You'll see a page with commands like:
```bash
git remote add origin https://github.com/YOUR_USERNAME/claude-architect-exam.git
git branch -M main
git push -u origin main
```

### 1b. Push Your Code to GitHub

The code is already in a local git repo at `/sessions/stoic-gallant-galileo/mnt/cca/claude-architect-exam/`. 

On your machine, open Terminal/PowerShell and navigate to the project:

```bash
cd /path/to/claude-architect-exam
# or: cd ~/Downloads/claude-architect-exam (if you saved it there)

# Add GitHub as the remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/claude-architect-exam.git

# Rename branch to 'main' for Vercel compatibility
git branch -M main

# Push to GitHub
git push -u origin main
```

**Expected output:**
```
Enumerating objects: 28, done.
Counting objects: 100% (28/28), done.
Delta compression using up to 8 threads
...
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ Your code is now on GitHub!

## Step 2: Deploy to Vercel

### 2a. Sign Up for Vercel (if needed)

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **GitHub** (the easiest)
4. Authorize Vercel to access your GitHub account
5. Complete setup

### 2b. Import Your Repository

1. In Vercel, click **New Project**
2. You'll see your GitHub repos listed. Select **`claude-architect-exam`**
3. Click **Import**

### 2c. Configure the Project

Vercel will auto-detect:
- **Framework**: Next.js ✅
- **Build Command**: `npm run build` ✅
- **Start Command**: `npm start` ✅

**Important settings:**
- **Environment Variables**: Leave empty (not needed for this project)
- **Root Directory**: `./` (already set)

Click **Deploy** and wait ~3 minutes...

### 2d. Deployment Complete! 🚀

Once the deploy finishes, you'll see:
- ✅ Deployment successful
- **Your URL**: `https://claude-architect-exam-[random].vercel.app`
- **Domain**: You can add a custom domain later (Settings → Domains)

**Test it**: Click the URL and your exam portal should load instantly!

## Step 3: Using Your Live Portal

### Start Practicing
- Visit your Vercel deployment URL
- All progress is saved **locally in your browser**
- No login required
- Works offline once loaded

### Making Updates

If you fix typos, add questions, or improve the UI:

```bash
# Make your changes locally
git add .
git commit -m "Update questions or features"
git push origin main
```

**Vercel auto-redeploys** in ~2 minutes. No manual intervention needed!

### Custom Domain (Optional)

In Vercel dashboard:
1. Select your project
2. Settings → Domains
3. Add custom domain (e.g., `cca-exam.yourname.com`)
4. Update DNS records per Vercel's instructions

## Troubleshooting

### "Page not found" after deploying?
- Give it 2-3 minutes for the build to complete
- Refresh the page
- Check the Deployment tab in Vercel for errors

### Build failed?
- Check Vercel logs (Deployments tab)
- Common issue: `npm install` failed due to disk space
- Solution: Clear node_modules locally and redeploy

### Questions not loading?
- Check browser console (F12 → Console)
- Ensure JavaScript is enabled
- Clear browser cache (Ctrl+Shift+Delete)

### localStorage not working?
- Private browsing might disable localStorage
- Try regular browsing mode
- Check browser privacy settings

## Important Notes

### Data Privacy
- ✅ All progress saved **locally in your browser**
- ✅ Nothing sent to Vercel servers (except the portal code)
- ✅ No user tracking or analytics
- ✅ Delete browser data anytime to clear progress

### Vercel Free Tier Limits (You won't hit these)
- **Bandwidth**: 100 GB/month (static site uses almost none)
- **Serverless functions**: 0 (we don't use them)
- **Build time**: 6000 min/month (one deploy = ~3 min)
- **Always free features**: Custom domains, SSL, analytics

### Performance
- First load: ~1 second (entire app is static)
- Subsequent loads: Nearly instant (cached)
- Fully functional offline after first load

## Alternative Deployment Options

### Option A: Netlify (Similar to Vercel)
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repo
3. Deploy (same as Vercel)

### Option B: Local-Only (No Deployment)
If you don't want to deploy, just run locally:
```bash
npm install
npm run dev
# Opens on http://localhost:3000
```

## Next Steps

1. **Update `.env` if needed** (currently not needed)
2. **Share your progress** - Show your domain to a friend or study group
3. **Keep practicing** - Aim for 720+ on a mock exam before the real thing
4. **Customize** - You can add more questions, themes, or features as you like

## Questions?

- **Vercel Help**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Help**: [nextjs.org/docs](https://nextjs.org/docs)
- **GitHub Help**: [docs.github.com](https://docs.github.com)

---

**Happy studying! 🎯**

Once deployed, bookmark your Vercel URL and start practicing. The adaptive algorithm will adjust question difficulty based on your performance.

Target score: **720/1000** ✅
