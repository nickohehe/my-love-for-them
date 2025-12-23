# Deployment Guide for GoDaddy / DreamHost

## Overview

This application consists of:
- **Frontend**: React + Vite (static files after build)
- **Backend**: Node.js/Express server (requires Node.js runtime)

## ⚠️ Important: Hosting Limitations

**GoDaddy** and **DreamHost** basic shared hosting **do NOT support Node.js**. You have two main options:

### Option 1: Separate Hosting (Recommended)
- **Frontend** → GoDaddy (static hosting)
- **Backend** → Free Node.js hosting (Railway, Render, Fly.io, etc.)

### Option 2: GoDaddy VPS/Dedicated Server
- Requires GoDaddy VPS or dedicated hosting with Node.js support
- More expensive but everything in one place

---

## Option 1: Separate Hosting (Recommended)

### Step 1: Deploy Backend to Free Node.js Hosting

#### Using Railway (Recommended - Free tier available)

1. **Create Railway account**: https://railway.app
2. **Create new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or upload files)
3. **Configure the project**:
   - Railway will auto-detect Node.js
   - Set start command: `node server.js`
   - Add environment variable: `PORT` (Railway sets this automatically)
   - Add environment variable: `ADMIN_KEY=your-secret-admin-key-here`
4. **Get your backend URL**: Railway will provide a URL like `https://your-app.railway.app`
5. **Update frontend**: Set `VITE_API_URL` to your Railway URL

#### Using Render (Alternative - Free tier available)

1. **Create Render account**: https://render.com
2. **Create new Web Service**:
   - Connect your GitHub repo or upload files
   - Build command: (leave empty or `npm install`)
   - Start command: `node server.js`
3. **Environment variables**:
   - `PORT`: (auto-set by Render)
   - `ADMIN_KEY`: your-secret-admin-key-here
4. **Get your backend URL**: Render provides URL like `https://your-app.onrender.com`

### Step 2: Build Frontend for Production

```bash
# Install dependencies (if not already done)
npm install

# Build the frontend
npm run build
```

This creates a `dist/` folder with all static files.

### Step 3: Update Frontend API URL

Before building, create a `.env.production` file:

```env
VITE_API_URL=https://your-backend-url.railway.app
```

Or if using Render:
```env
VITE_API_URL=https://your-app.onrender.com
```

Then rebuild:
```bash
npm run build
```

### Step 4: Deploy Frontend to GoDaddy or DreamHost

#### Option A: GoDaddy Deployment

**Via GoDaddy cPanel (if available):**

1. **Login to GoDaddy** → My Products → cPanel
2. **Open File Manager** or use FTP
3. **Navigate to `public_html`** (or your domain's root folder)
4. **Upload all files from `dist/` folder**:
   - Upload all files from the `dist/` directory
   - Make sure `index.html` is in the root
5. **Upload `.htaccess` file** (already created in project root)

**Via FTP:**

1. **Get FTP credentials** from GoDaddy:
   - Host: `ftp.yourdomain.com` or IP address
   - Username: (from GoDaddy)
   - Password: (from GoDaddy)
2. **Use FTP client** (FileZilla, WinSCP, etc.):
   - Connect to your GoDaddy server
   - Navigate to `public_html`
   - Upload all files from `dist/` folder
   - Upload `.htaccess` file

#### Option B: DreamHost Deployment (Recommended for DreamHost)

**Via DreamHost Panel:**

1. **Login to DreamHost Panel**: https://panel.dreamhost.com
2. **Go to Domains** → Manage Domains
3. **Click "Edit"** next to your domain
4. **Note your web directory** (usually `/home/username/yourdomain.com`)

**Via SFTP (Secure FTP - Recommended):**

1. **Get SFTP credentials** from DreamHost:
   - Host: `yourdomain.com` or `server.dreamhost.com`
   - Username: (your DreamHost username)
   - Password: (your DreamHost password)
   - Port: `22` (for SFTP)
2. **Use SFTP client**:
   - **FileZilla**: Use SFTP protocol (not FTP)
   - **WinSCP**: Select SFTP protocol
   - **VS Code**: Use SFTP extension
3. **Connect and upload**:
   - Navigate to your domain's web directory (e.g., `/home/username/yourdomain.com`)
   - Upload all files from `dist/` folder
   - Upload `.htaccess` file to the root

**Via DreamHost File Manager (Web-based):**

1. **Login to DreamHost Panel**
2. **Go to Files** → Manage Files
3. **Navigate to your domain folder**
4. **Upload files**:
   - Click "Upload Files"
   - Select all files from `dist/` folder
   - Upload `.htaccess` file separately

**DreamHost-specific notes:**
- DreamHost uses **SFTP** (port 22) instead of regular FTP
- Web directory is usually: `/home/username/yourdomain.com`
- `.htaccess` file works the same way
- DreamHost has better performance than GoDaddy for static sites

### Step 5: Update Vite Config for Production

Make sure your `vite.config.ts` has the correct base path if needed:

```typescript
export default defineConfig({
  base: '/', // Change to '/your-subfolder/' if deploying to subfolder
  // ... rest of config
});
```

---

## Option 2: Full Stack on VPS (DreamHost VPS or GoDaddy VPS)

### DreamHost VPS (Recommended if using DreamHost)

DreamHost offers VPS hosting with full Node.js support. This is a good option if you want everything in one place.

If you have DreamHost VPS, GoDaddy VPS, or any Linux VPS:

### Step 1: Set Up Node.js on Server

1. **SSH into your server**
   - **DreamHost**: Use your domain or `server.dreamhost.com`
   - **GoDaddy VPS**: Use the IP address provided
   - Command: `ssh username@yourdomain.com` or `ssh username@server.dreamhost.com`

2. **Install Node.js**:
   ```bash
   # Using NodeSource (recommended for Ubuntu/Debian)
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Verify installation
   node --version
   npm --version
   ```

   **Note for DreamHost VPS:**
   - DreamHost VPS usually comes with Node.js pre-installed
   - Check with: `node --version`
   - If not installed, use the commands above

### Step 2: Upload Files

**Option A: Via SFTP (DreamHost) or FTP (GoDaddy)**
- Upload all project files to a directory like `/home/username/christmas-letters`

**Option B: Via Git (Recommended)**
```bash
# On your server
cd /home/username
git clone https://github.com/yourusername/your-repo.git christmas-letters
cd christmas-letters
```

**Option C: Via rsync (from your local machine)**
```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.git' ./ username@yourdomain.com:/home/username/christmas-letters/
```

### Step 3: Install Dependencies

```bash
cd /path/to/your/project
npm install --production
```

### Step 4: Set Up Environment Variables

Create `.env` file:
```env
PORT=3001
ADMIN_KEY=your-secret-admin-key-here
```

### Step 5: Run with PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the server
pm2 start server.js --name "christmas-letters"

# Make it start on boot
pm2 startup
pm2 save
```

### Step 6: Set Up Reverse Proxy (Nginx or Apache)

**Option A: Using Nginx (if available on your VPS)**

```nginx
# /etc/nginx/sites-available/your-domain
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /home/username/yourdomain.com;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # SSE endpoint
    location /api/notifications {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Cache-Control 'no-cache';
        proxy_buffering off;
        chunked_transfer_encoding off;
    }
}
```

Then enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Option B: Using Apache (DreamHost default)**

DreamHost typically uses Apache. Create or edit `.htaccess` in your domain root:

```apache
# Frontend routing (already in .htaccess)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Proxy API requests to backend
<IfModule mod_proxy.c>
  ProxyPreserveHost On
  ProxyPass /api http://localhost:3001/api
  ProxyPassReverse /api http://localhost:3001/api
</IfModule>
```

**Note**: You may need to enable Apache modules:
```bash
# On DreamHost, contact support or use panel
# On your own server:
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo systemctl restart apache2
```

---

## Important Files to Include/Exclude

### Files to Upload to GoDaddy/DreamHost (Frontend):
- ✅ Everything from `dist/` folder (after build)
- ✅ `.htaccess` (for routing)

### Files to Upload to Backend Host:
- ✅ `server.js`
- ✅ `package.json`
- ✅ `data/` folder (will be created automatically)
- ❌ `node_modules/` (install on server)
- ❌ `src/` (not needed for backend)
- ❌ `dist/` (not needed for backend)

### Files NOT to Upload:
- ❌ `.env` files (set environment variables on hosting platform)
- ❌ `node_modules/` (install on server)
- ❌ `.git/` folder

---

## Environment Variables Checklist

### Backend (Railway/Render/etc.):
- `PORT` - Usually auto-set by platform
- `ADMIN_KEY` - Your secret admin key

### Frontend (Build-time):
- `VITE_API_URL` - Your backend URL (e.g., `https://your-app.railway.app`)

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend can connect to backend (check browser console)
- [ ] Test opening a letter
- [ ] Test notifications
- [ ] Test admin panel
- [ ] Check that `data/opened-letters.json` persists on backend

---

## Troubleshooting

### Frontend can't connect to backend:
- Check `VITE_API_URL` is set correctly
- Check CORS is enabled on backend (already done)
- Check backend URL is accessible

### 404 errors on page refresh:
- Add `.htaccess` file for routing (see Step 4)

### Backend not starting:
- Check Node.js version (needs Node 18+)
- Check `PORT` environment variable
- Check server logs

---

## DreamHost-Specific Tips

1. **SFTP Access**: DreamHost uses SFTP (port 22), not regular FTP
2. **File Permissions**: Make sure files are readable:
   ```bash
   chmod 644 /home/username/yourdomain.com/*
   chmod 755 /home/username/yourdomain.com
   ```
3. **PHP Disabled**: If you get PHP errors, DreamHost may have PHP enabled by default. You can disable it in the panel.
4. **Subdomain Option**: Consider using a subdomain like `api.yourdomain.com` for the backend if using VPS
5. **DreamHost Panel**: Very user-friendly for managing domains and files

## Alternative: Use Vercel/Netlify (Easier)

If GoDaddy/DreamHost is too complicated, consider:
- **Vercel**: Free hosting for frontend + serverless functions
- **Netlify**: Free hosting for frontend + serverless functions
- Both have better Node.js support and easier deployment

Would you like me to create deployment configs for Vercel or Netlify instead?

