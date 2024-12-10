import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Schema for settings update
const SettingsSchema = z.object({
  openAIKey: z.string().startsWith('sk-', 'Invalid OpenAI API key format'),
});

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found',
      });
    }

    res.json({
      status: 'success',
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile',
    });
  }
});

// Update profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { businessDetails, contentPrefs, voiceProfile } = req.body;

    const profile = await prisma.profile.update({
      where: { userId: req.user!.id },
      data: {
        businessDetails,
        contentPrefs,
        voiceProfile,
      },
    });

    res.json({
      status: 'success',
      data: profile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
    });
  }
});

// Update settings
router.post('/settings', authenticateToken, async (req, res) => {
  try {
    const { openAIKey } = SettingsSchema.parse(req.body);

    // Get current profile
    const currentProfile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!currentProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found',
      });
    }

    // Update profile with new metadata
    const updatedProfile = await prisma.profile.update({
      where: { userId: req.user!.id },
      data: {
        metadata: {
          ...(currentProfile.metadata as Prisma.JsonObject || {}),
          openAIKey,
        },
      },
    });

    res.json({
      status: 'success',
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid API key format',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update settings',
    });
  }
});

export default router; 