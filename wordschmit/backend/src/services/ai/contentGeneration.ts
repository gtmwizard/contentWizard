import { PrismaClient, Prisma } from '@prisma/client';
import { Configuration, OpenAIApi } from 'openai';
import { GenerationSettings, ScheduleSettings } from '../../types/content';

const prisma = new PrismaClient();

export async function generateContent(topic: string, settings: GenerationSettings, userId: string) {
  try {
    // Get user's API key from profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { metadata: true },
    });

    const metadata = profile?.metadata as Prisma.JsonObject | undefined;
    if (!metadata || !('openAIKey' in metadata)) {
      throw new Error('OpenAI API key not found');
    }

    const openai = new OpenAIApi(
      new Configuration({
        apiKey: metadata.openAIKey as string,
      })
    );

    // Generate content using OpenAI
    const prompt = generatePrompt(topic, settings);
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const generatedContent = response.data.choices[0]?.message?.content;
    if (!generatedContent) {
      throw new Error('Failed to generate content');
    }

    return generatedContent;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export async function scheduleContent(
  content: string,
  type: string,
  scheduleSettings: ScheduleSettings,
  userId: string
) {
  try {
    const { date, time, repeat, platforms } = scheduleSettings;
    const scheduledFor = new Date(`${date.toISOString().split('T')[0]}T${time}`);

    const savedContent = await prisma.content.create({
      data: {
        userId,
        type,
        content,
        status: 'scheduled',
        scheduledFor,
        metadata: {
          platforms,
          scheduleRule: repeat !== 'none' ? { repeat, platforms } : null,
        } as Prisma.JsonObject,
      },
    });

    return savedContent;
  } catch (error) {
    console.error('Error scheduling content:', error);
    throw error;
  }
}

function generatePrompt(topic: string, settings: GenerationSettings): string {
  const { type, tone, keywords, length, targetAudience, industry } = settings;

  return `Create a ${type === 'blog' ? `${length}-word blog post` : type === 'linkedin' ? 'LinkedIn post' : 'Twitter post'} 
about ${topic}.

Tone: ${tone}
Target Audience: ${targetAudience}
Industry: ${industry}
Keywords to include: ${keywords.join(', ')}

The content should be engaging, well-structured, and optimized for the chosen platform.
${type === 'twitter' ? 'Keep it within 280 characters.' : ''}
${type === 'linkedin' ? 'Include relevant hashtags and maintain a professional tone.' : ''}
${type === 'blog' ? 'Include a compelling headline, clear sections, and a strong call-to-action.' : ''}`;
} 