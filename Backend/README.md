# ⚙️ MINDSPACE Backend

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-orange.svg)](https://firebase.google.com)
[![Google AI](https://img.shields.io/badge/Google-Gemini-purple.svg)](https://ai.google.dev)

> 🧠 **The intelligent backend powering MINDSPACE's mental health support system**

## 🎯 Overview

The MINDSPACE Backend is a robust FastAPI-based server that provides the core intelligence for our mental health chatbot. It integrates with Google's Gemini AI for natural language processing, Firebase for data management, and includes advanced features like multilingual text-to-speech and conversation management.

## 🏗️ Architecture

```
Backend/
├── 🐍 script.py              # Main FastAPI application
├── 📦 requirements.txt       # Python dependencies
├── 🔥 firebase.json          # Firebase service account
├── 🐳 Dockerfile             # Container configuration
├── 🚀 vercel.json            # Vercel deployment config
└── 📚 README.md              # This file
```

## 🚀 Features

### 🧠 AI-Powered Responses
- **Google Gemini Integration** - Advanced language understanding
- **Contextual Conversations** - Maintains conversation history
- **Multilingual Support** - 9+ Indian languages
- **Mental Health Expertise** - Specialized prompts and responses

### 🎵 Audio Generation
- **Text-to-Speech** - Converts responses to audio
- **Multilingual TTS** - Supports regional languages
- **Base64 Encoding** - Efficient audio transmission
- **Error Handling** - Graceful fallbacks

### 🔐 Security & Data
- **Firebase Authentication** - Secure user management
- **Realtime Database** - User data and conversation storage
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Pydantic models for data integrity

### 📊 Monitoring & Health
- **Health Checks** - `/health` endpoint for monitoring
- **Error Logging** - Comprehensive error tracking
- **Performance Metrics** - Response time monitoring
- **Graceful Degradation** - Fallback mechanisms

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| 🐍 **Runtime** | Python 3.12 | Core language |
| ⚡ **Framework** | FastAPI | Web framework |
| 🤖 **AI** | Google Gemini | Language processing |
| 🔥 **Database** | Firebase Realtime DB | Data storage |
| 🎵 **TTS** | Google Text-to-Speech | Audio generation |
| 🌍 **Language** | langdetect | Language detection |
| 📦 **Dependencies** | pip | Package management |

## 🚀 Quick Start

### Prerequisites

- 🐍 Python 3.12+
- 🔑 Google Gemini API key
- 🔥 Firebase project with Realtime Database
- 📁 Firebase service account JSON file

### Installation

1. **Clone and navigate**
   ```bash
   git clone https://github.com/yourusername/mindspace-chatbot.git
   cd mindspace-chatbot/Backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   # Create .env file
   echo "GEMINI_API_KEY=your_gemini_api_key" > .env
   echo "DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/" >> .env
   echo "SERVICE_ACCOUNT_KEY_PATH=firebase.json" >> .env
   ```

5. **Add Firebase credentials**
   - Download your Firebase service account JSON
   - Rename it to `firebase.json`
   - Place it in the Backend directory

6. **Run the server**
   ```bash
   uvicorn script:app --reload --host 0.0.0.0 --port 8000
   ```

## 📡 API Endpoints

### 🗣️ Chat Endpoints

#### `POST /chat/{user_id}`
Start or continue a conversation with the AI.

**Request Body:**
```json
{
  "user_id": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "response": "AI response text",
  "audio": "base64_encoded_audio",
  "language": "detected_language_code"
}
```

#### `POST /clear-conversation/{user_id}`
Clear conversation history for a user.

**Response:**
```json
{
  "message": "Conversation history cleared for user {user_id}"
}
```

### 🏥 Health Endpoints

#### `GET /`
Basic health check.

**Response:**
```json
{
  "status": "healthy",
  "message": "MindSpace API is running"
}
```

#### `GET /health`
Detailed health check.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 🌍 Language Endpoints

#### `GET /supported-languages`
Get list of supported languages.

**Response:**
```json
{
  "languages": ["hi", "bn", "gu", "kn", "ml", "mr", "ta", "te", "pa"],
  "language_mapping": {
    "hindi": "hi",
    "bengali": "bn",
    "gujarati": "gu",
    "kannada": "kn",
    "malayalam": "ml",
    "marathi": "mr",
    "tamil": "ta",
    "telugu": "te",
    "punjabi": "pa"
  }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | ✅ | - |
| `DATABASE_URL` | Firebase Realtime Database URL | ✅ | - |
| `SERVICE_ACCOUNT_KEY_PATH` | Path to Firebase service account JSON | ✅ | `firebase.json` |

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Realtime Database

2. **Generate Service Account**
   - Go to Project Settings → Service Accounts
   - Generate new private key
   - Download JSON file as `firebase.json`

3. **Configure Database Rules**
   ```json
   {
     "rules": {
       "users": {
         "$uid": {
           ".read": "auth != null && auth.uid === $uid",
           ".write": "auth != null && auth.uid === $uid"
         }
       }
     }
   }
   ```

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t mindspace-backend .
```

### Run Container
```bash
docker run -p 8000:8000 \
  -e GEMINI_API_KEY=your_key \
  -e DATABASE_URL=your_url \
  -v $(pwd)/firebase.json:/app/firebase.json \
  mindspace-backend
```

### Docker Compose
```bash
docker-compose up backend
```

## 🚀 Production Deployment

### Render Deployment

1. **Connect Repository**
   - Link your GitHub repository to Render
   - Set root directory to `Backend`

2. **Configure Environment**
   - Add environment variables in Render dashboard
   - Upload `firebase.json` file

3. **Deploy**
   - Render will automatically build and deploy
   - Monitor logs for any issues

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:8000/health

# Chat test
curl -X POST "http://localhost:8000/chat/test_user" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "message": "Hello"}'
```

### Automated Testing
```bash
# Run tests (when implemented)
pytest tests/
```

## 📊 Monitoring

### Health Checks
- **Endpoint**: `/health`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3

### Logging
- **Level**: INFO
- **Format**: Structured JSON
- **Output**: Console + File (production)

### Metrics
- Response time
- Error rate
- Request count
- Memory usage

## 🔒 Security

### Authentication
- Firebase Admin SDK
- Service account authentication
- Token-based access

### Data Protection
- Input validation with Pydantic
- SQL injection prevention
- XSS protection
- CORS configuration

### Privacy
- No conversation logging
- User data encryption
- GDPR compliance ready

## 🐛 Troubleshooting

### Common Issues

#### 1. Firebase Authentication Error
```
ValueError: Invalid certificate argument: "None"
```
**Solution**: Ensure `firebase.json` is in the correct location and `SERVICE_ACCOUNT_KEY_PATH` is set.

#### 2. Gemini API Error
```
google.generativeai.types.BadRequestException
```
**Solution**: Check your `GEMINI_API_KEY` and ensure it's valid.

#### 3. TTS Audio Error
```
TTS error: [Errno 2] No such file or directory
```
**Solution**: Ensure all TTS dependencies are installed and network access is available.

