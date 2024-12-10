# Content Wizard 🪄

Content Wizard is an AI-powered content creation platform that helps businesses generate personalized content across multiple platforms. It uses advanced language models to create content that matches your brand voice and business context.

## Features ✨

- **AI-Powered Content Generation**: Create blog posts, LinkedIn posts, and Twitter content using GPT-4
- **Personalized Content**: Content tailored to your business context and voice profile
- **Multi-Platform Support**: Generate content for different platforms with appropriate formatting
- **Version Control**: Track content revisions and maintain content history
- **User Management**: Secure authentication and profile management
- **API Key Management**: Secure storage and management of OpenAI API keys

## Tech Stack 🛠️

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Context API for state management

### Backend
- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- LangChain
- OpenAI GPT-4
- JWT Authentication

### Development & Deployment
- Docker for database
- npm for package management
- Environment variables for configuration

## Prerequisites 📋

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL
- OpenAI API key

## Installation 🚀

1. Clone the repository:
```bash
git clone [repository-url]
cd content-wizard
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# In backend directory
cp .env.example .env
```
Edit `.env` file with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/content_wizard"
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:5173"
```

4. Start the database:
```bash
# In backend directory
docker-compose up -d
```

5. Run database migrations:
```bash
# In backend directory
npx prisma migrate deploy
```

6. Start the development servers:
```bash
# Start backend (in backend directory)
npm run dev

# Start frontend (in frontend directory)
npm run dev
```

## Usage 💡

1. Register an account and complete the onboarding process
2. Add your OpenAI API key in the Settings page
3. Navigate to Create Content to start generating content
4. Choose your content type, topic, and preferences
5. Generate and edit content as needed
6. View and manage your content in the Dashboard

## Project Structure 📁

```
content-wizard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Endpoints 🔌

### Authentication
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: User login

### Profile
- `GET /api/profile`: Get user profile
- `PUT /api/profile`: Update profile
- `POST /api/profile/settings`: Update API settings

### Content
- `GET /api/content`: Get all user content
- `POST /api/content/generate`: Generate new content
- `GET /api/content/:id`: Get specific content
- `PUT /api/content/:id`: Update content
- `DELETE /api/content/:id`: Delete content

## Security 🔒

- JWT-based authentication
- Secure API key storage
- Password hashing
- CORS protection
- Input validation

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

[License Type] - See LICENSE file for details 