# Agent Elohim - AI Assistant Platform

A comprehensive AI assistant platform featuring chat interfaces, business analytics, content generation, image creation, voice processing, and local AI capabilities.

## 🚀 Features

- **AI Chat Interface**: Direct conversations with Mistral 4B Instruct model
- **Voice Processing**: Whisper transcription + Coqui speech synthesis
- **Content Generation**: Blogs, emails, social posts, and marketing copy
- **Image Generation**: Stable Diffusion artwork and designs
- **Business Analytics**: KPI dashboards and task management
- **Music Player**: AI-generated tracks and playlists
- **Local AI Support**: Ollama model integration
- **Connection Monitoring**: Real-time VPS health tracking

## 🛠 Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM (fallback to in-memory)
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query + React hooks
- **AI Integration**: Agent Elohim VPS (Mistral 4B Instruct)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agent-elohim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** (Optional)
   ```bash
   # Create .env file for database connection
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the platform**
   Open http://localhost:5000 in your browser

## 🌐 VPS Integration

The platform connects to an external Agent Elohim VPS for AI processing:

- **Endpoint**: http://178.16.143.5:3000
- **Authentication**: Bearer token with custom API key
- **Services**: Chat (/respond), Voice (/voice), Speech (/speak), Health (/health)
- **Fallback**: Local AI responses when VPS unavailable

## 📁 Project Structure

```
agent-elohim/
├── client/src/          # Frontend React application
│   ├── components/      # UI components
│   ├── pages/          # Application pages
│   ├── services/       # API services
│   └── hooks/          # Custom React hooks
├── server/             # Backend Express server
│   ├── routes.ts       # API routes
│   ├── db.ts          # Database configuration
│   └── storage.ts     # Data storage layer
├── shared/            # Shared types and schemas
└── package.json       # Dependencies and scripts
```

## 🎯 Usage

### Chat Interface
Ask questions and get intelligent AI responses. The system automatically falls back to local AI when the VPS is unavailable.

### Content Generation
1. Go to Content tab
2. Select content type (blog, email, social, ad)
3. Enter your prompt
4. Generate professional content

### Voice Chat
1. Click Voice tab
2. Record voice messages
3. Get AI responses via text-to-speech
4. Full voice-to-voice conversations

### Business Tools
Access analytics dashboards, KPI tracking, and task management features.

## 🔐 Security

- Custom API key authentication for VPS access
- Client/server separation for secure data handling
- Bearer token protection for all AI endpoints
- Environment variable management for sensitive data

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database Setup
The application automatically detects and uses PostgreSQL when `DATABASE_URL` is provided, otherwise falls back to in-memory storage.

## 📈 Features Overview

- **9 AI Modules**: Complete suite of AI-powered tools
- **Real-time Monitoring**: VPS connection status and performance
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Automatic theme switching
- **Error Handling**: Graceful fallbacks and user feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎉 Credits

Built with Agent Elohim VPS integration for high-performance AI processing without external dependencies.

---

**Ready to deploy your AI assistant platform!**