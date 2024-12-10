import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Validation schemas
const ContentSettingsSchema = z.object({
  type: z.enum(["blog", "linkedin", "twitter"]),
  tone: z.string(),
  length: z.number().optional(),
  keywords: z.array(z.string()).optional(),
  targetAudience: z.string(),
  industry: z.string(),
});

const BusinessContextSchema = z.object({
  businessName: z.string(),
  industry: z.string(),
  description: z.string(),
  targetAudience: z.string(),
});

const VoiceProfileSchema = z.object({
  writingStyle: z.object({
    formality: z.string(),
    complexity: z.string(),
    emotion: z.string(),
  }),
});

export type ContentSettings = z.infer<typeof ContentSettingsSchema>;
export type BusinessContext = z.infer<typeof BusinessContextSchema>;
export type VoiceProfile = z.infer<typeof VoiceProfileSchema>;

export class ContentGenerationService {
  private llm: ChatOpenAI;
  private templates: Map<string, PromptTemplate>;

  constructor(apiKey: string) {
    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4-1106-preview",
      temperature: 0.7,
    });

    // Initialize templates
    this.templates = new Map();
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Blog post template
    this.templates.set(
      "blog",
      new PromptTemplate({
        template: `You are a professional content writer for {businessName}, a {industry} company.
        Write a blog post about {topic} that resonates with {targetAudience}.
        
        Business Context:
        {businessDescription}
        
        Writing Style:
        - Formality: {formality}
        - Complexity: {complexity}
        - Emotional Tone: {emotion}
        
        Additional Requirements:
        - Length: {length} words
        - Keywords to include: {keywords}
        - Maintain a {tone} tone throughout the content
        
        The blog post should be informative, engaging, and aligned with our brand voice.
        Include a compelling headline, clear structure, and a strong call-to-action.`,
        inputVariables: [
          "businessName",
          "industry",
          "topic",
          "targetAudience",
          "businessDescription",
          "formality",
          "complexity",
          "emotion",
          "length",
          "keywords",
          "tone",
        ],
      })
    );

    // LinkedIn post template
    this.templates.set(
      "linkedin",
      new PromptTemplate({
        template: `As a thought leader in {industry}, create a LinkedIn post for {businessName}.
        
        Topic: {topic}
        Target Audience: {targetAudience}
        
        Business Context:
        {businessDescription}
        
        Writing Style:
        - Formality: {formality}
        - Complexity: {complexity}
        - Emotional Tone: {emotion}
        
        Requirements:
        - Keep it professional yet engaging
        - Include relevant hashtags
        - Maximum length: 3000 characters
        - Keywords to include: {keywords}
        - Maintain a {tone} tone
        
        Focus on providing value and encouraging engagement.`,
        inputVariables: [
          "businessName",
          "industry",
          "topic",
          "targetAudience",
          "businessDescription",
          "formality",
          "complexity",
          "emotion",
          "keywords",
          "tone",
        ],
      })
    );

    // Twitter/X post template
    this.templates.set(
      "twitter",
      new PromptTemplate({
        template: `Create a Twitter/X post for {businessName} ({industry}).
        
        Topic: {topic}
        Target Audience: {targetAudience}
        
        Key Message:
        {businessDescription}
        
        Style:
        - Tone: {tone}
        - Formality: {formality}
        - Emotion: {emotion}
        
        Requirements:
        - Maximum 280 characters
        - Include relevant hashtags
        - Keywords: {keywords}
        - Make it engaging and shareable`,
        inputVariables: [
          "businessName",
          "industry",
          "topic",
          "targetAudience",
          "businessDescription",
          "formality",
          "emotion",
          "keywords",
          "tone",
        ],
      })
    );
  }

  async generateContent(
    topic: string,
    settings: ContentSettings,
    businessContext: BusinessContext,
    voiceProfile: VoiceProfile
  ) {
    try {
      // Validate inputs
      ContentSettingsSchema.parse(settings);
      BusinessContextSchema.parse(businessContext);
      VoiceProfileSchema.parse(voiceProfile);

      const template = this.templates.get(settings.type);
      if (!template) {
        throw new Error(`Unsupported content type: ${settings.type}`);
      }

      const prompt = await template.format({
        topic,
        businessName: businessContext.businessName,
        industry: businessContext.industry,
        targetAudience: businessContext.targetAudience,
        businessDescription: businessContext.description,
        formality: voiceProfile.writingStyle.formality,
        complexity: voiceProfile.writingStyle.complexity,
        emotion: voiceProfile.writingStyle.emotion,
        length: settings.length || "500-800",
        keywords: settings.keywords?.join(", ") || "none specified",
        tone: settings.tone,
      });

      const result = await this.llm.invoke(prompt);

      return {
        content: result.content,
        metadata: {
          model: "gpt-4-1106-preview",
          settings,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw error;
    }
  }
} 