import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret-key-change-me';
const DATA_FILE = path.join(__dirname, 'data', 'opened-letters.json');

// Store connected SSE clients
const sseClients = new Set();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read opened letters from file
async function getOpenedLetters() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Write opened letters to file
async function saveOpenedLetters(openedLetters) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(openedLetters, null, 2), 'utf-8');
}

// Broadcast notification to all connected clients
function broadcastNotification(name) {
  const message = JSON.stringify({ type: 'letter-opened', name, timestamp: Date.now() });
  sseClients.forEach((client) => {
    try {
      client.write(`data: ${message}\n\n`);
    } catch (error) {
      console.error('Error sending SSE message:', error);
      sseClients.delete(client);
    }
  });
}

// Middleware to check admin key
function checkAdminKey(req, res, next) {
  const providedKey = (req.headers['x-admin-key'] || req.query.adminKey || '').trim();
  const expectedKey = ADMIN_KEY.trim();
  
  if (providedKey !== expectedKey) {
    console.log(`Admin key mismatch. Provided: "${providedKey}", Expected: "${expectedKey}"`);
    return res.status(401).json({ error: 'Unauthorized: Invalid admin key' });
  }
  
  next();
}

// GET /api/opened-letters - Get list of opened letter names
app.get('/api/opened-letters', async (req, res) => {
  try {
    const openedLetters = await getOpenedLetters();
    res.json(openedLetters);
  } catch (error) {
    console.error('Error reading opened letters:', error);
    res.status(500).json({ error: 'Failed to read opened letters' });
  }
});

// POST /api/opened-letters - Mark a letter as opened
app.post('/api/opened-letters', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const openedLetters = await getOpenedLetters();
    
    // Check if already opened
    if (openedLetters.includes(name)) {
      return res.json({ message: 'Letter already marked as opened', openedLetters });
    }

    // Add to opened letters
    openedLetters.push(name);
    await saveOpenedLetters(openedLetters);

    // Broadcast notification to all connected clients
    broadcastNotification(name);

    res.json({ message: 'Letter marked as opened', openedLetters });
  } catch (error) {
    console.error('Error marking letter as opened:', error);
    res.status(500).json({ error: 'Failed to mark letter as opened' });
  }
});

// ADMIN ENDPOINTS

// GET /api/admin/opened-letters - Get all opened letters (admin only)
app.get('/api/admin/opened-letters', checkAdminKey, async (req, res) => {
  try {
    const openedLetters = await getOpenedLetters();
    res.json({ openedLetters, count: openedLetters.length });
  } catch (error) {
    console.error('Error reading opened letters:', error);
    res.status(500).json({ error: 'Failed to read opened letters' });
  }
});

// DELETE /api/admin/opened-letters/:name - Restore a letter (remove from opened list)
app.delete('/api/admin/opened-letters/:name', checkAdminKey, async (req, res) => {
  try {
    const { name } = req.params;
    
    const openedLetters = await getOpenedLetters();
    const index = openedLetters.indexOf(name);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Letter not found in opened list' });
    }

    // Remove from opened letters
    openedLetters.splice(index, 1);
    await saveOpenedLetters(openedLetters);

    res.json({ 
      message: `Letter "${name}" has been restored and is now available again`, 
      openedLetters 
    });
  } catch (error) {
    console.error('Error restoring letter:', error);
    res.status(500).json({ error: 'Failed to restore letter' });
  }
});

// POST /api/admin/reset - Reset all opened letters (admin only)
app.post('/api/admin/reset', checkAdminKey, async (req, res) => {
  try {
    await saveOpenedLetters([]);
    res.json({ message: 'All letters have been restored' });
  } catch (error) {
    console.error('Error resetting letters:', error);
    res.status(500).json({ error: 'Failed to reset letters' });
  }
});

// SSE endpoint for real-time notifications
app.get('/api/notifications', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering in nginx

  // Add client to the set
  sseClients.add(res);

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to notifications' })}\n\n`);

  // Send heartbeat every 30 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    try {
      res.write(`: heartbeat\n\n`);
    } catch (error) {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 30000);

  // Remove client when connection closes
  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin key: ${ADMIN_KEY}`);
  console.log(`To restore a letter, use: DELETE /api/admin/opened-letters/:name with header x-admin-key`);
});

