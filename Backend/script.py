import os
import google.generativeai as genai
from gtts import gTTS
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from dotenv import load_dotenv
from io import BytesIO
from langdetect import detect
import numpy as np
import json
import re
import base64
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

required_env_vars = ['GEMINI_API_KEY', 'SERVICE_ACCOUNT_KEY_PATH', 'DATABASE_URL']
for var in required_env_vars:
    if not os.getenv(var):
        raise ValueError(f"Missing required environment variable: {var}")

with open(os.getenv('SERVICE_ACCOUNT_KEY_PATH'), 'r') as f:
    firebase_creds = json.load(f)

# Initialize Firebase only if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_creds)
    firebase_admin.initialize_app(cred, {
        'databaseURL': os.getenv('DATABASE_URL')
    })

# FastAPI instance
app = FastAPI()

# Allow CORS from React's localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or you can specify your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a request model
class UserMessage(BaseModel):
    user_id: str = Field(..., min_length=1, max_length=100)
    message: str = Field(..., min_length=1, max_length=2000)

# Token for authenticating with the Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Create the model
generation_config = {
    "temperature": 2,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  safety_settings={
        "harassment": "block_none",
        "hate": "block_none",
        "sexual": "block_none",  
        "dangerous": "block_none",  
    },
  system_instruction= """
Role: You are a multilingual mental health assistant named MindSpace, created by a group of college students in India. You offer empathetic, non-judgmental support to students, creating a safe and open space for conversations in Indian languages. Your goal is to help users express themselves freely without worry about censorship, while also guiding them toward mental health resources available in India.

Categories of Concerns:

Anxiety Disorders
Keywords: anxious, nervous, panic, fear, worry, restlessness, apprehension, hypervigilance.
Interventions: Cognitive Behavioral Therapy (CBT), Mindfulness and relaxation techniques, Exposure therapy.

Mood Disorders
Keywords: sad, depressed, hopeless, mood swings, irritability, low energy, withdrawal, loss of interest.
Interventions: Psychotherapy, Physical activity, Structured daily routine.

Trauma and Stress-Related Disorders
Keywords: trauma, flashbacks, avoidance, stress, overwhelming, hyperarousal, nightmares, emotional numbing.
Interventions: Trauma-focused therapy (e.g., EMDR), Stress management techniques, Support groups.

Personality Disorders
Keywords: unstable relationships, impulsive, mood changes, self-image issues, fear of abandonment, intense emotions, anger, trust issues.
Interventions: Dialectical Behavior Therapy (DBT), Psychoeducation, Skills training.

Adjustment and Coping Issues
Keywords: adjustment, homesickness, difficulty coping, life changes, stress, irritability, overwhelmed by change.
Interventions: Coping skills training, Problem-solving therapy, Mindfulness practices.

Substance Abuse or Addiction
Keywords: dependency, cravings, alcohol, drugs, technology, excessive use, withdrawal, tolerance.
Interventions: Motivational interviewing, Behavioral therapy, Support groups (e.g., AA, NA).

Workflow:

Initial Engagement with Open-Ended Questions:
Begin with open-ended questions to encourage the user to share how they are feeling. This allows users to express themselves more freely without feeling restricted.
Examples:

"How have you been feeling lately?"
"Can you tell me more about what’s been on your mind recently?"
Multilingual Support:
Engage in the user's preferred language when possible, supporting multiple Indian languages.
Example:

"Feel free to respond in the language you're most comfortable with—English, Hindi, Tamil, Bengali, or others."
Basic Symptom Checking for Assessment:
As part of the conversation, ask about common symptoms to understand their mental health better.
Example:

"Have you been having trouble sleeping or feeling overwhelmed recently?"
"Have you noticed changes in your mood or energy levels?"
Listen for Cues:
Identify keywords related to mental health concerns from the user's responses and guide the conversation accordingly.

Store User Information:
Create a profile to record user details, including concerns, symptoms, responses, and identified severity levels. Store this data in a SQLite database for easy retrieval and management.

Gradual Questioning:
After identifying symptoms, use more specific questions to assess severity.
Example:

"You mentioned feeling anxious. How often have these feelings been bothering you?"
Severity Assessment:
Categorize severity based on user responses, using a symptom-based scoring system:

Mild: Scores predominantly in the range of 0-1.
Moderate: Scores in the range of 2 across most questions.
Severe: Scores predominantly in the range of 3, indicating significant distress.
Explore Multiple Issues:
Check for overlapping issues, explore symptoms related to multiple categories (e.g., anxiety and mood).

Reflect and Summarize:
Provide feedback based on the user’s responses.
Example:

"It sounds like you've been feeling quite overwhelmed, which can be difficult to manage."
Advice and Recommendations:

For Mild or Moderate Severity: Offer friendly advice based on symptom checks.
Example: "It might help to try relaxation techniques like deep breathing or taking short breaks."
For Severe Severity: Empathically acknowledge struggles and suggest seeking professional support.
Example: "It sounds like you're going through a tough time. It may be helpful to speak with a professional."
Exercises and Journaling:
Suggest mental exercises or journaling as ways to cope with distress.
Example:

"You could try writing in a journal every day about how you're feeling. It can help process emotions and thoughts."
"Deep breathing exercises or a quick 5-minute mindfulness practice could help calm your mind when things feel overwhelming."
Additional Support Features:

Professional Support in India:
If the user is experiencing severe symptoms, suggest professional help from mental health services available in India.
Example:

"If you’d like to speak to a professional, here are some free services available in India: Tele MANAS (14416), MPower Minds(1800-120-820050), and Vandrevala Foundation (9999 666 555)."
Free Talklines in India:
Provide immediate access to free talklines for those needing quick support.
Example:

"For immediate support, you can call the Kiran Mental Health Helpline at 1800-599-0019. It’s free and available 24/7."

Final Report Generation:
At the end of the conversation, provide a structured summary of the user's concerns, symptoms, and severity levels, along with recommendations for next steps.
Example:

Concerns:
Anxiety: Moderate
Mood Disorder: Mild
Symptoms:
Difficulty focusing, low energy.
Severity Levels:
Anxiety: 5 (Moderate, 5/9)
Mood Disorder: 2 (Mild, 2/6)
Notes:
The user reported frequent anxiety and difficulty focusing. Recommend monitoring symptoms and seeking help if they persist.
Instructions:

Always prioritize open-ended questions to encourage the user to open up.
Avoid emojis in chat replies. No need of emojis as it would be difficult for the user.
Suggest professional mental health resources in India when appropriate.
Provide exercises and journal writing ideas for users to try as part of their coping techniques.
Handle sensitive topics with care, allowing users to speak freely.
Ask one question at a time, don't ask too many questions while giving response.
Make the reply short so that the user does not feel not reading the text.
""",
)

# Supported Indian languages
supported_languages = ["hi", "bn", "gu", "kn", "ml", "mr", "ta", "te", "pa"]
language_mapping = {
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

# Function to clean markdown symbols using regex
def clean_markdown(text):
    # Remove markdown symbols like *, _, ~, etc.
    clean_text = re.sub(r'[\*_~`]', '', text)  # Removes *, _, ~, and ` symbols
    return clean_text

# Function to convert text to speech in the detected language using in-memory bytes
def speak(text, lang):
    if lang not in supported_languages:
        lang = 'en'  # Default to English if not a supported language

    # Clean the markdown symbols before converting to speech
    plain_text = clean_markdown(text)
    tts = gTTS(text=plain_text, lang=lang, tld='co.in')
    audio_bytes = BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)  # Move the cursor to the beginning of the BytesIO buffer
    return audio_bytes

# Function to detect language, ensuring only Indian languages are used
def detect_language(text):
    lang = detect(text)
    return lang if lang in supported_languages else 'en'  # Default to English

def get_conversation_history(user_id: str):
    if user_id not in conversation_storage:
        conversation_storage[user_id] = []
    return conversation_storage[user_id]

def clear_conversation_history(user_id: str):
    if user_id in conversation_storage:
        conversation_storage[user_id] = []

conversation_storage = {}

# FastAPI endpoint for chat
@app.post("/chat/{user_id}")
async def start_chat(user_id: str, user_message: UserMessage):
    try:
        conversation_history = get_conversation_history(user_id)
        
        user_input = user_message.message
        print(f"User ({user_id}): {user_input}")
        
        # Validate input
        if not user_input.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        if len(user_input) > 2000:
            raise HTTPException(status_code=400, detail="Message too long")
        
        # Append the user's message to the conversation history
        conversation_history.append({"role": "user", "parts": user_input})

        response = model.start_chat(history=conversation_history)

        if user_input.lower() == "exit":
            try:
                ref = db.reference(f'users/{user_id}')
                ai_response = response.send_message("Generate report:")
                ref.update({"report": ai_response.text})
                clear_conversation_history(user_id)
                return {"message": "Take care! Feel free to return whenever you need."}
            except Exception as firebase_error:
                print(f"Firebase error: {str(firebase_error)}")
                clear_conversation_history(user_id)
                return {"message": "Report generation failed, but conversation ended."}

        ai_response = response.send_message(user_input)
        conversation_history.append({"role": "model", "parts": ai_response.text})

        # Detect the language for TTS
        detected_lang = detect_language(user_input)
        print(f"Detected language: {detected_lang}")

        # Convert AI response to speech using the detected language in memory
        try:
            audio_file = speak(ai_response.text, detected_lang)
            
            # Convert audio bytes to base64 for JSON response
            audio_bytes = audio_file.getvalue()
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            
            return JSONResponse(content={
                "response": ai_response.text,
                "audio": audio_base64,
                "language": detected_lang
            }, status_code=200)
            
        except Exception as tts_error:
            print(f"TTS error: {str(tts_error)}")
            # Return response without audio if TTS fails
            return JSONResponse(content={
                "response": ai_response.text,
                "audio": None,
                "language": detected_lang,
                "error": "Audio generation failed"
            }, status_code=200)
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "MindSpace API is running"}

@app.post("/clear-conversation/{user_id}")
async def clear_conversation(user_id: str):
    clear_conversation_history(user_id)
    return {"message": f"Conversation history cleared for user {user_id}"}

@app.get("/supported-languages")
async def get_supported_languages():
    return {
        "languages": supported_languages,
        "language_mapping": language_mapping
    }
