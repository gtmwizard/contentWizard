import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { ContentGenerationService } from '../services/ai/contentGeneration';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for content generation request
const ContentRequestSchema = z.object({
  topic: z.string(),
  settings: z.object({
    type: z.enum(["blog", "linkedin", "twitter"]),
    tone: z.string(),
    length: z.number().optional(),
    keywords: z.array(z.string()).optional(),
    targetAudience: z.string(),
    industry: z.string(),
  }),
});

// Get all content for the user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const content = await prisma.content.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        versions: {
          orderBy: { version: 'desc' },
        },
      },
    });

    res.json({
      status: 'success',
      data: content,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch content',
    });
  }
});

// Generate new content
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { topic, settings } = ContentRequestSchema.parse(req.body);

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
      select: {
        businessDetails: true,
        voiceProfile: true,
        metadata: true,
      },
    });

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found',
      });
    }

    // Get API key from profile metadata
    const metadata = profile.metadata as Prisma.JsonObject;
    const apiKey = metadata.openAIKey as string;

    if (!apiKey) {
      return res.status(400).json({
        status: 'error',
        message: 'OpenAI API key not found in profile settings',
      });
    }

    const contentService = new ContentGenerationService(apiKey);
    const result = await contentService.generateContent(
      topic,
      settings,
      profile.businessDetails as any,
      profile.voiceProfile as any
    );

    // Create content record
    const content = await prisma.content.create({
      data: {
        userId: req.user!.id,
        type: settings.type,
        title: topic,
        content: typeof result.content === 'string' ? result.content : result.content.toString(),
        status: 'draft',
        metadata: result.metadata as Prisma.JsonObject,
      },
    });

    // Create initial version
    await prisma.$transaction(async (tx) => {
      await tx.contentVersion.create({
        data: {
          contentId: content.id,
          version: 1,
          data: typeof result.content === 'string' ? result.content : result.content.toString(),
          metadata: result.metadata as Prisma.JsonObject,
        },
      });
    });

    res.json({
      status: 'success',
      data: content,
    });
  } catch (error) {
    console.error('Error generating content:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request data',
        details: error.errors,
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate content',
    });
  }
});

// Get content by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const content = await prisma.content.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        versions: {
          orderBy: { version: 'desc' },
        },
      },
    });

    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found',
      });
    }

    res.json({
      status: 'success',
      data: content,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch content',
    });
  }
});

// Update content
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { content: newContent } = req.body;

    const content = await prisma.content.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found',
      });
    }

    // Update content
    const updatedContent = await prisma.content.update({
      where: { id: req.params.id },
      data: { content: newContent },
    });

    // Get latest version number
    const latestVersion = await prisma.$transaction(async (tx) => {
      const latest = await tx.contentVersion.findFirst({
        where: { contentId: content.id },
        orderBy: { version: 'desc' },
        select: { version: true },
      });

      const nextVersion = (latest?.version ?? 0) + 1;

      // Create new version
      await tx.contentVersion.create({
        data: {
          contentId: content.id,
          version: nextVersion,
          data: newContent,
          metadata: {
            type: 'manual-edit',
            timestamp: new Date().toISOString(),
          } as Prisma.JsonObject,
        },
      });

      return latest;
    });

    res.json({
      status: 'success',
      data: updatedContent,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update content',
    });
  }
});

// Delete content
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const content = await prisma.content.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found',
      });
    }

    // Delete content and its versions (cascade delete will handle versions)
    await prisma.content.delete({
      where: { id: req.params.id },
    });

    res.json({
      status: 'success',
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete content',
    });
  }
});

export default router; 