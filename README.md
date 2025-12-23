# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Install backend dependencies (if not already installed).
npm i

# Step 5: Start both the backend server and frontend development server.
npm run dev:all

# Or run them separately:
# Terminal 1: Start the backend server
npm run dev:server

# Terminal 2: Start the frontend
npm run dev
```

## Backend Server

This project includes a backend server that tracks which letters have been opened. The server:

- Runs on `http://localhost:3001` by default
- Stores opened letters in `data/opened-letters.json`
- Provides API endpoints:
  - `GET /api/opened-letters` - Get list of opened letter names
  - `POST /api/opened-letters` - Mark a letter as opened

**Note**: Once a letter is opened, it disappears from the website for all users. The opened state is stored server-wide in the `data/opened-letters.json` file.

## Admin Panel

To restore letters that have been opened, you can use the admin panel:

1. **Access the admin panel**: Navigate to `http://localhost:8080/admin/login`
2. **Enter admin key**: The default admin key is `admin-secret-key-change-me`
3. **Restore letters**: Once logged in, you can restore individual letters or reset all letters

### Changing the Admin Key

Set the `ADMIN_KEY` environment variable when starting the server:

```bash
ADMIN_KEY=your-secret-key node server.js
```

### Using the API Directly

You can also use the API endpoints directly:

**Get all opened letters:**
```bash
curl -H "x-admin-key: admin-secret-key-change-me" http://localhost:3001/api/admin/opened-letters
```

**Restore a specific letter:**
```bash
curl -X DELETE -H "x-admin-key: admin-secret-key-change-me" http://localhost:3001/api/admin/opened-letters/Jhulia
```

**Reset all letters:**
```bash
curl -X POST -H "x-admin-key: admin-secret-key-change-me" http://localhost:3001/api/admin/reset
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
