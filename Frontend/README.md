# 🎨 MINDSPACE Frontend

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.1.0-purple.svg)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4.1-cyan.svg)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-10.14.0-orange.svg)](https://firebase.google.com)

> 🌟 **A beautiful, responsive web application for MINDSPACE mental health chatbot**

## 🎯 Overview

The MINDSPACE Frontend is a modern, responsive React.js application that provides an intuitive and accessible interface for users to interact with our mental health chatbot. Built with cutting-edge technologies, it offers a seamless user experience across all devices.

## 🏗️ Architecture

```
Frontend/
├── 🎨 src/
│   ├── 📱 components/        # Reusable UI components
│   ├── 📄 pages/            # Main application pages
│   ├── 🔧 utils/            # Utility functions
│   ├── 🎨 assets/           # Images, icons, and static files
│   ├── 🔥 firebase.js       # Firebase configuration
│   └── 🎯 main.jsx          # Application entry point
├── 📦 package.json          # Dependencies and scripts
├── ⚙️ vite.config.js        # Vite configuration
├── 🎨 tailwind.config.js    # Tailwind CSS configuration
├── 🐳 Dockerfile            # Container configuration
└── 📚 README.md             # This file
```

## ✨ Features

### 🎨 User Interface
- **Modern Design** - Clean, intuitive interface
- **Responsive Layout** - Works on all screen sizes
- **Dark/Light Mode** - User preference support
- **Accessibility** - WCAG 2.1 compliant
- **Animations** - Smooth transitions and micro-interactions

### 💬 Chat Experience
- **Real-time Messaging** - Instant AI responses
- **Audio Playback** - Listen to AI responses
- **Message History** - Persistent conversation storage
- **Typing Indicators** - Visual feedback during processing
- **Emoji Support** - Enhanced emotional expression

### 🔐 Authentication
- **Google Sign-in** - One-click authentication
- **Firebase Auth** - Secure user management
- **Session Persistence** - Stay logged in across sessions
- **Profile Management** - User data and preferences


## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| ⚛️ **Framework** | React 18.2.0 | UI framework |
| ⚡ **Build Tool** | Vite 5.1.0 | Fast development |
| 🎨 **Styling** | Tailwind CSS 3.4.1 | Utility-first CSS |
| 🔥 **Backend** | Firebase 10.14.0 | Authentication & database |
| 🌐 **Routing** | React Router 6.26.2 | Client-side routing |
| 📡 **HTTP** | Axios 1.7.7 | API communication |
| 🎵 **Audio** | Web Audio API | Audio playback |
| 📱 **PWA** | Vite PWA Plugin | Progressive web app |

## 🚀 Quick Start

### Prerequisites

- 📦 Node.js 18+
- 📱 Modern web browser
- 🔑 Firebase project
- ⚙️ Backend API running

### Installation

1. **Clone and navigate**
   ```bash
   git clone https://github.com/thisis-gp/mindspace-chatbot.git
   cd mindspace-chatbot/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env with your values
   VITE_FIREBASE_APIKEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGE_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com/
   VITE_FASTAPI_LINK=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📱 Pages & Components

### 🏠 Landing Page
- **Hero Section** - Compelling introduction
- **Features Showcase** - Key benefits
- **Call-to-Action** - Get started button

### 🔐 Login Page
- **Google Sign-in** - One-click authentication
- **Terms & Privacy** - Legal compliance
- **Error Handling** - User-friendly messages
- **Loading States** - Visual feedback

### 💬 Dashboard
- **Chat Interface** - Main conversation area
- **Message History** - Previous conversations
- **Audio Controls** - Play/pause AI responses
- **Voice Input** - Record audio messages
- **Suggested Prompts** - Quick start options

### 🧩 Components

#### 🎨 UI Components
- **Button** - Customizable button component
- **Input** - Form input with validation
- **Card** - Content container
- **Modal** - Overlay dialogs
- **Navbar** - Navigation header
- **Footer** - Page footer

#### 🔧 Functional Components
- **AuthContext** - Authentication state management
- **API** - Backend communication
- **AudioPlayer** - Audio playback controls
- **VoiceRecorder** - Audio recording
- **MessageList** - Chat message display

## 🎨 Styling & Theming

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#06B6D4',
        accent: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Custom CSS Classes
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Theme switching support
- **Animations** - Smooth transitions
- **Accessibility** - Focus states and ARIA labels

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_FIREBASE_APIKEY` | Firebase API key | ✅ | - |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ | - |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ | - |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ | - |
| `VITE_FIREBASE_MESSAGE_SENDER_ID` | Firebase messaging sender ID | ✅ | - |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | ✅ | - |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics ID | ❌ | - |
| `VITE_FIREBASE_DATABASE_URL` | Firebase database URL | ✅ | - |
| `VITE_FASTAPI_LINK` | Backend API URL | ✅ | `http://localhost:8000` |

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication and Realtime Database

2. **Configure Authentication**
   - Enable Google Sign-in provider
   - Add authorized domains
   - Configure OAuth consent screen

3. **Set up Realtime Database**
   - Create database in test mode
   - Configure security rules
   - Enable offline persistence

## 🚀 Build & Deployment

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Production Build
```bash
# Build optimized bundle
npm run build

# Output will be in dist/ directory
```

### Vercel Deployment

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Set root directory to `Frontend`

2. **Configure Environment**
   - Add environment variables in Vercel dashboard
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Deploy**
   - Vercel will automatically build and deploy
   - Custom domain configuration available

### Docker Deployment

```bash
# Build image
docker build -t mindspace-frontend .

# Run container
docker run -p 3000:80 mindspace-frontend
```

## 🧪 Testing

### Manual Testing
```bash
# Start dev server
npm run dev

# Test in browser
open http://localhost:3000
```
### Automated Testing
```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

### Browser Testing
- **Chrome** - Latest version
- **Firefox** - Latest version
- **Safari** - Latest version
- **Edge** - Latest version
- **Mobile** - iOS Safari, Chrome Mobile

## 📊 Performance

### Optimization Features
- **Code Splitting** - Lazy loading of components
- **Tree Shaking** - Remove unused code
- **Image Optimization** - Compressed assets
- **Caching** - Browser and CDN caching
- **Bundle Analysis** - Size monitoring

### Performance Metrics
- **First Contentful Paint** - < 1.5s
- **Largest Contentful Paint** - < 2.5s
- **Cumulative Layout Shift** - < 0.1
- **First Input Delay** - < 100ms

## 🔒 Security

### Authentication Security
- **Firebase Auth** - Secure token management
- **HTTPS Only** - Encrypted communication
- **CORS Protection** - Cross-origin security
- **Input Validation** - XSS prevention

### Data Protection
- **No Sensitive Data** - Client-side storage
- **Encrypted Transit** - HTTPS/TLS
- **Privacy First** - Minimal data collection
- **GDPR Compliant** - Privacy regulations

## 🐛 Troubleshooting

### Common Issues

#### 1. Firebase Authentication Error
```
Firebase: Error (auth/unauthorized-domain)
```
**Solution**: Add your domain to Firebase authorized domains.

#### 2. API Connection Error
```
Network Error: Failed to fetch
```
**Solution**: Check `VITE_FASTAPI_LINK` and ensure backend is running.

#### 3. Audio Playback Error
```
Audio playback error: NotSupportedError
```
**Solution**: Check browser audio support and codec compatibility.

#### 4. Build Error
```
Module not found: Can't resolve 'module'
```
**Solution**: Clear node_modules and reinstall dependencies.


