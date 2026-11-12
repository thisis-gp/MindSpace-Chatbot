# 🧠 MINDSPACE - Mental Health Chatbot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com)

> 🌟 **An innovative, multilingual mental health chatbot designed to provide personalized emotional support to students**

## 📖 About MINDSPACE

MINDSPACE is an innovative, mental health chatbot designed to provide personalized emotional support to students. Recognizing the increasing mental health challenges faced by students today, MINDSPACE aims to bridge the gap in accessible mental health resources.

The chatbot offers support, ensuring that users from diverse backgrounds can access guidance in their preferred language. It delivers responses in both text and audio formats, enhancing friendliness and accessibility. Through compassionate mental health guidance, MINDSPACE addresses a range of issues, including anxiety, stress, trauma, and coping strategies, providing users with relevant and non-judgmental advice.

### 🎯 Key Features

- 🎵 **Audio Responses** - Text-to-speech in user's preferred language
- 🤖 **AI-Powered** - Powered by Google's Gemini AI
- 🔒 **Secure & Private** - Firebase authentication and data protection
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🧘 **Technique-informed prompts** - CBT and mindfulness ideas
- ⏰ **24/7 Availability** - Always there when you need support

## 🏗️ Architecture

```
MINDSPACE/
├── 🖥️  Frontend/          # React.js web application
├── ⚙️  Backend/           # FastAPI Python server
├── 🐳 Docker/             # Containerization files
├── 🚀 CI/CD/              # GitHub Actions workflows
└── 📚 Documentation/      # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- 🐍 Python 3.12+
- 📦 Node.js 18+
- 🔥 Firebase project
- 🤖 Google Gemini API key

### 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thisis-gp/mindspace-chatbot.git
   cd mindspace-chatbot
   ```

2. **Set up Backend**
   ```bash
   cd Backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up Frontend**
   ```bash
   cd Frontend
   npm install
   ```

4. **Configure Environment Variables**
   ```bash
   # Backend (.env)
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=your_firebase_database_url
   SERVICE_ACCOUNT_KEY_PATH=firebase.json
   
   # Frontend (.env)
   VITE_FIREBASE_APIKEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   ```

5. **Run the application**
   ```bash
   # Terminal 1 - Backend
   cd Backend
   uvicorn script:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2 - Frontend
   cd Frontend
   npm run dev
   ```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
docker-compose up --build
```

### Individual Services
```bash
# Backend only
cd Backend && docker build -t mindspace-backend . && docker run -p 8000:8000 mindspace-backend

# Frontend only
cd Frontend && docker build -t mindspace-frontend . && docker run -p 3000:80 mindspace-frontend
```

## 🌐 Deployment

### 🎯 Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set root directory to `Frontend`
3. Add environment variables in Vercel dashboard
4. Deploy! 🚀

### ⚙️ Backend (Render)
1. Connect your GitHub repository to Render
2. Set root directory to `Backend`
3. Add environment variables
4. Upload `firebase.json` file
5. Deploy! 🚀

## 🧠 Mental Health Support

### 🎯 What MINDSPACE Addresses

- 😰 **Anxiety Disorders** - Panic, worry, restlessness
- 😔 **Mood Disorders** - Depression, mood swings, low energy
- 🚨 **Trauma & Stress** - Flashbacks, overwhelming feelings
- 🎭 **Personality Issues** - Relationship problems, emotional regulation
- 🔄 **Adjustment Issues** - Life changes, homesickness
- 🚫 **Addiction Support** - Substance abuse, technology dependency

### 🛠️ Evidence-Based Interventions

- 🧘 **Cognitive Behavioral Therapy (CBT)**
- 🧠 **Mindfulness & Relaxation Techniques**
- 📝 **Journaling & Self-Reflection**
- 🎯 **Problem-Solving Therapy**
- 🤝 **Support Group Recommendations**

### 🆘 Crisis Resources (India)

- **Tele MANAS**: 14416
- **MPower Minds**: 1800-120-820050
- **Vandrevala Foundation**: 9999 666 555
- **Kiran Mental Health Helpline**: 1800-599-0019

## 🛡️ Privacy & Security

- 🔐 **Firebase Authentication** - Secure user login
- 🔒 **Data Encryption** - All data encrypted in transit and at rest
- 🚫 **No Data Sharing** - Your conversations stay private
- 🗑️ **Data Deletion** - Clear conversation history option

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

## 📊 Project Status

- ✅ **Core Features** - Complete
- ✅ **Multilingual Support** - Complete
- ✅ **Audio Responses** - Complete
- ✅ **Authentication** - Complete
- 🔄 **Mobile App** - In Progress
- 🔄 **Professional Integration** - Planned

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Basic chatbot functionality
- [x] Audio responses
- [x] User authentication

### Phase 2: Enhancement 🔄
- [ ] Mobile application
- [ ] Advanced personalization
- [ ] Mood tracking
- [ ] Crisis intervention protocols

### Phase 3: Integration 🔮
- [ ] Professional therapist network
- [ ] University partnerships
- [ ] Research collaboration
- [ ] Advanced AI capabilities

## 📌 Current status

- The Backend in this repo serves chat, text-to-speech and language detection only (`/chat`, `/clear-conversation`, `/supported-languages`).
- The mood, journal, distress score, psychologist list, booking and report screens in the Frontend call endpoints that this Backend does not implement yet, so they need a backend before they work.
- MindSpace is an AI companion and not a substitute for professional help. In India, Tele-MANAS (14416, free, 24x7) and 112 (emergency) are available.
- The Backend starts without Firebase or Gemini credentials; chat then answers with a clear "not configured" message.

## 🏆 Recognition

- Best Intervention Award, TYCL Mental Health Exhibition 2024, Puducherry


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

*Remember: You're not alone. MINDSPACE is here for you. 💙*
