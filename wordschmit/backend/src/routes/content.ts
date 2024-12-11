import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { generateContent, scheduleContent } from '../services/ai/contentGeneration';

const router = express.Router();
const prisma = new PrismaClient();

// Generate content
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { topic, settings } = req.body;
    const userId = req.user!.id;

    if (!topic || !settings) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const generatedContent = await generateContent(topic, settings, userId);

    res.json({
      message: 'Content generated successfully',
      data: { content: generatedContent },
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ message: 'Failed to generate content' });
  }
});

// Schedule content
router.post('/schedule', authenticateToken, async (req, res) => {
  try {
    const { content, type, scheduleSettings } = req.body;
    const userId = req.user!.id;

    if (!content || !type || !scheduleSettings) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const scheduledContent = await scheduleContent(
      content,
      type,
      scheduleSettings,
      userId
    );

    res.json({
      message: 'Content scheduled successfully',
      data: scheduledContent,
    });
  } catch (error) {
    console.error('Error scheduling content:', error);
    res.status(500).json({ message: 'Failed to schedule content' });
  }
});

// Get user's content
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { status } = req.query;

    const contents = await prisma.content.findMany({
      where: {
        userId,
        ...(status ? { status: status as string } : {}),
      },
      orderBy: [
        { scheduledFor: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      message: 'Content retrieved successfully',
      data: contents,
    });
  } catch (error) {
    console.error('Error retrieving content:', error);
    res.status(500).json({ message: 'Failed to retrieve content' });
  }
});

export default router; 