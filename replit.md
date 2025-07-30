# Agent Elohim - AI Assistant Platform

## Overview
Agent Elohim is a comprehensive AI assistant platform that has been successfully migrated from Lovable to Replit. The platform includes advanced features like AI chat interfaces, business analytics tools, a jukebox music player, and local AI capabilities.

## Recent Changes
- **2025-01-30**: Successfully migrated from Lovable to Replit environment
- **2025-01-30**: Replaced react-router-dom with wouter for Replit compatibility
- **2025-01-30**: Removed all Supabase dependencies and created local service alternatives
- **2025-01-30**: Created comprehensive component suite including ChatInterface, BusinessTools, JukeboxHero, and LocalChat
- **2025-01-30**: Fixed routing and import issues, application now running successfully
- **2025-01-30**: Integrated Agent Elohim VPS connection with Mistral 4B Instruct model
- **2025-01-30**: Added database support with PostgreSQL and fallback to in-memory storage
- **2025-01-30**: MAJOR UPDATE: Integrated full Agent Elohim All-in-One VPS deployment
  - Updated API endpoints to use /respond with Bearer custom API key authentication
  - Added comprehensive voice service with Whisper transcription and Coqui speech synthesis
  - Enhanced 8-module platform: Chat, Content Generator, Image Generator, Voice Chat, Business Tools, Jukebox, Local Chat, Connection Settings
  - Voice chat now connects directly to VPS for full voice-to-voice AI conversations
  - Memory logging and auto-restart capabilities enabled on VPS
  - Secured with custom API key: fuPRVYCaxDpnlR03nUojV1umTfS3zjpLIaoSAuoY35e337a5

## Project Architecture

### Frontend Structure
- **Framework**: React with TypeScript
- **Routing**: Wouter (Replit-compatible alternative to react-router-dom)
- **UI Components**: Shadcn/ui with Tailwind CSS
- **State Management**: React hooks with localStorage for persistence
- **HTTP Client**: TanStack Query for data fetching

### Key Components
- **ChatInterface**: Main AI chat component with message history
- **BusinessTools**: Business analytics dashboard with metrics and task management
- **JukeboxHero**: Music player with AI-generated tracks and playlists
- **LocalChat**: Local AI chat with Ollama integration
- **ConnectionTester**: Tool for testing AI service connections

### Backend Structure
- **Server**: Express.js server
- **Database**: PostgreSQL with Drizzle ORM (with in-memory fallback)
- **AI Services**: Agent Elohim VPS (Mistral 4B Instruct), Local Ollama integration
- **Security**: Client/server separation, VPS connection with health monitoring

### Migration Completed
✅ Environment setup with Node.js 20 and package installations
✅ Successfully migrated routing from react-router-dom to wouter
✅ Removed all Supabase dependencies
✅ Created essential hooks (useModules, useExitIntent) and components
✅ Fixed CSS animation issues and missing dependencies
✅ Application running cleanly on Replit

## User Preferences
- The application should maintain security best practices with client/server separation
- Local AI capabilities are preferred over external API dependencies
- The platform should be modular with feature-based access control
- Dark theme is the default interface theme

## Development Notes
- Database setup ready - uses PostgreSQL with Drizzle ORM when DATABASE_URL is available
- Falls back to in-memory storage (MemStorage) when no database is configured
- All AI services have mock implementations for demonstration
- Real integrations can be enabled by providing appropriate API keys
- The application is designed for easy deployment on Replit

## Database Setup
The application supports both PostgreSQL and in-memory storage:
- **With Database**: Automatically uses PostgreSQL when DATABASE_URL environment variable is set
- **Without Database**: Falls back to in-memory storage for development/demo purposes
- To add a database, create a PostgreSQL database in Replit and the app will automatically detect and use it

## Next Steps
- Application is ready for use and further development
- Database schema is set up and can be extended as needed
- All core features are functional and can be enhanced
- Agent Elohim VPS integration active with connection monitoring
- Ready for user testing and feedback

## AI Integration
- **Agent Elohim VPS**: Full deployment at 178.16.143.5:3000 with Mistral 4B Instruct core
- **Voice Processing**: Whisper for transcription, Coqui for speech synthesis
- **API Endpoints**: 
  - /respond for text chat (Bearer elohim-core auth)
  - /voice for voice message processing
  - /speak for speech synthesis
  - /health for connection monitoring
- **Memory System**: Persistent memory.json logging for conversation continuity
- **Auto-Recovery**: Service auto-restarts on crash/boot for 24/7 availability
- **Security**: Bearer token authentication (custom API key: fuPRVYCaxDpnlR03nUojV1umTfS3zjpLIaoSAuoY35e337a5)
- **Response Quality**: Direct connection to high-performance AI model