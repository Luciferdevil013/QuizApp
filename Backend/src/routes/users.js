import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const usersPath = path.join(__dirname, '../data/users.json');

// Helper function to read users
async function readUsers() {
  try {
    const data = await fs.readFile(usersPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, create it with empty array
      await fs.writeFile(usersPath, '[]');
      return [];
    }
    throw error;
  }
}

// Helper function to write users
async function writeUsers(users) {
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
}

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data without password
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Error getting profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    if (username) {
      users[userIndex].username = username;
    }
    if (password) {
      users[userIndex].password = password; // In a real app, hash the password
    }

    await writeUsers(users);

    // Return updated user data without password
    const { password: _, ...userData } = users[userIndex];
    res.json(userData);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router; 