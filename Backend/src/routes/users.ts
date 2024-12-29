import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import auth from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

// Test route to verify the router is working
router.get('/test', (_req: Request, res: Response) => {
  res.json({ message: 'Users routes are working!' });
});

// Get current user profile
router.get('/profile', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Profile update request received');
    console.log('User ID:', req.userId);
    console.log('Request body:', req.body);
    
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      console.log('User not found with ID:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name if provided
    if (name) {
      user.name = name;
      console.log('Name updated to:', name);
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        console.log('Password verification failed');
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      console.log('Password updated successfully');
    }

    await user.save();
    console.log('Profile updated successfully');

    // Return updated user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      score: user.score,
      rank: user.rank,
      isAdmin: user.isAdmin
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Profile update error:', error);
    next(error);
  }
});

export default router; 