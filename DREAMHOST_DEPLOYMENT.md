# Step-by-Step DreamHost Deployment Guide

## Prerequisites
- DreamHost account with a domain
- Backend deployed to Railway/Render (free Node.js hosting)
- Your project built and ready

---

## Part 1: Deploy Backend First (Required)

### Step 1: Deploy to Railway (Recommended - Free)

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select your repository**
5. **Configure**:
   - Railway auto-detects Node.js
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `ADMIN_KEY`: `your-secret-admin-key-here` (choose a strong password)
     - `PORT`: (Railway sets this automatically)
6. **Wait for deployment** (takes 2-3 minutes)
7. **Copy your backend URL**: Something like `https://your-app.railway.app`
   - Click on your service → Settings → Domains
   - Or use the default Railway URL

### Alternative: Deploy to Render

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **New** → **Web Service**
4. **Connect your repository**
5. **Configure**:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `ADMIN_KEY`: `your-secret-admin-key-here`
6. **Deploy** and copy your URL: `https://your-app.onrender.com`

---

## Part 2: Prepare Frontend for DreamHost

### Step 2: Set Up Environment Variables

1. **Create `.env.production` file** in your project root:
   ```env
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   Replace with your actual Railway/Render URL

2. **Build the frontend**:
   ```bash
   npm run build
   ```
   
   This creates a `dist/` folder with all your static files.

3. **Verify the build**:
   - Check that `dist/index.html` exists
   - Check that `dist/assets/` folder has your JS/CSS files

---

## Part 3: Upload to DreamHost

### Step 3: Get Your DreamHost Credentials

1. **Login to DreamHost Panel**: https://panel.dreamhost.com
2. **Go to**: **Domains** → **Manage Domains**
3. **Find your domain** and click **Edit**
4. **Note your web directory**: Usually `/home/username/yourdomain.com`
5. **Get SFTP credentials**:
   - **Host**: `yourdomain.com` or check **Users** → **Manage Users** for server name
   - **Username**: Your DreamHost username
   - **Password**: Your DreamHost password (or create SFTP-only user)
   - **Port**: `22` (SFTP)

### Step 4: Connect via SFTP

**Option A: Using FileZilla (Recommended)**

1. **Download FileZilla**: https://filezilla-project.org
2. **Open FileZilla**
3. **File** → **Site Manager** → **New Site**
4. **Configure**:
   - **Protocol**: `SFTP - SSH File Transfer Protocol`
   - **Host**: `yourdomain.com` (or server name from DreamHost)
   - **Port**: `22`
   - **Logon Type**: `Normal`
   - **User**: Your DreamHost username
   - **Password**: Your DreamHost password
5. **Click Connect**

**Option B: Using DreamHost File Manager (Web-based)**

1. **Login to DreamHost Panel**
2. **Go to**: **Files** → **Manage Files**
3. **Navigate to your domain folder**: `/home/username/yourdomain.com`

### Step 5: Upload Files

1. **Navigate to your domain folder** in FileZilla (right side):
   - Usually: `/home/username/yourdomain.com`
   - Or: `/home/username/yourdomain.com/public`

2. **On your local computer** (left side), navigate to your project's `dist/` folder

3. **Select ALL files and folders** from `dist/`:
   - `index.html`
   - `assets/` folder (and everything inside)
   - Any other files in `dist/`

4. **Drag and drop** or **Right-click** → **Upload** all files to DreamHost

5. **Upload `.htaccess` file**:
   - The `.htaccess` file is in your project root (not in dist/)
   - Upload it to the same location as `index.html`

### Step 6: Set File Permissions (If Needed)

If files don't load properly, set permissions via SSH or FileZilla:

1. **Connect via SSH** (optional, but easier):
   ```bash
   ssh username@yourdomain.com
   ```

2. **Set permissions**:
   ```bash
   cd /home/username/yourdomain.com
   chmod 644 *.html
   chmod 644 assets/*
   chmod 755 assets
   chmod 644 .htaccess
   ```

Or in FileZilla:
- Right-click file → **File permissions**
- Set to `644` for files, `755` for folders

---

## Part 4: Verify Deployment

### Step 7: Test Your Website

1. **Visit your domain**: `https://yourdomain.com`
2. **Check browser console** (F12) for errors
3. **Test opening a letter**:
   - Select a person
   - Enter password
   - Verify it works
4. **Check notifications**:
   - Open in two browsers
   - Open a letter in one
   - See if notification appears in the other

### Step 8: Common Issues & Fixes

**Issue: 404 errors when refreshing page**
- **Fix**: Make sure `.htaccess` file is uploaded and in the root directory

**Issue: Can't connect to backend**
- **Fix**: Check `VITE_API_URL` in `.env.production` matches your backend URL
- **Fix**: Rebuild: `npm run build` and re-upload

**Issue: Files not loading**
- **Fix**: Check file permissions (should be 644 for files, 755 for folders)
- **Fix**: Verify files are in correct directory

**Issue: Backend not working**
- **Fix**: Check Railway/Render dashboard for errors
- **Fix**: Verify `ADMIN_KEY` environment variable is set
- **Fix**: Check backend logs in Railway/Render

---

## Part 5: Update Domain (Optional)

### Step 9: Point Domain to Backend (If Using Custom Domain)

If you want `api.yourdomain.com` to point to your backend:

1. **In Railway/Render**: Add custom domain `api.yourdomain.com`
2. **In DreamHost Panel**: 
   - Go to **Domains** → **DNS**
   - Add **A Record**:
     - **Name**: `api`
     - **Value**: Railway/Render IP (they'll provide this)
   - Or add **CNAME**:
     - **Name**: `api`
     - **Value**: `your-app.railway.app` (or Render equivalent)

3. **Update `.env.production`**:
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

4. **Rebuild and re-upload**:
   ```bash
   npm run build
   # Re-upload dist/ folder
   ```

---

## Quick Reference Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend URL copied
- [ ] `.env.production` created with backend URL
- [ ] Frontend built (`npm run build`)
- [ ] SFTP credentials obtained from DreamHost
- [ ] Connected to DreamHost via SFTP
- [ ] All files from `dist/` uploaded
- [ ] `.htaccess` file uploaded
- [ ] File permissions set (if needed)
- [ ] Website tested and working
- [ ] Backend connection verified
- [ ] Notifications working

---

## File Structure on DreamHost

After upload, your DreamHost directory should look like:

```
/home/username/yourdomain.com/
├── index.html
├── .htaccess
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    └── ... (other assets)
```

---

## Need Help?

- **DreamHost Support**: https://help.dreamhost.com
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs

---

## Summary

1. **Deploy backend** to Railway/Render (5 minutes)
2. **Build frontend** with backend URL (1 minute)
3. **Upload to DreamHost** via SFTP (5-10 minutes)
4. **Test** and verify everything works

Total time: ~15-20 minutes

