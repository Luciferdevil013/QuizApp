import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Read existing users
    const users = await readUsers();

    // Check if username already exists
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      isAdmin: false
    };

    // Add user to array
    users.push(newUser);

    // Save updated users array
    await writeUsers(users);

    // Create token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, isAdmin: newUser.isAdmin },
      'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return success with token and user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Read users
    const users = await readUsers();

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return success with token and user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

export default router;