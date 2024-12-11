import { config } from 'dotenv';
config();

export const productionConfig = {
  port: process.env.PORT || 3001,
  nodeEnv: 'production',
  cors: {
    origin: process.env.FRONTEND_URL || 'https://wordschmit.com',
    credentials: true
  },
  database: {
    url: process.env.DATABASE_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  security: {
    rateLimitRequests: 100,
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    bcryptSaltRounds: 12
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
}; 