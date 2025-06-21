import os
import json
import speech_recognition as sr
from flask import Flask, request, jsonify, send_file
from gtts import gTTS
import tempfile
from flask_cors import CORS
from pydub import AudioSegment


app = Flask(__name__)

# Get the frontend URL from environment variable, with fallback for local development
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")

# Define allowed origins - include common Vercel domains
allowed_origins = [
    "http://localhost:3000",
    "https://localhost:3000"
]

# Add production frontend URL if provided
if frontend_url:
    allowed_origins.append(frontend_url)

# Add common Vercel domains
vercel_domains = [
    "https://*.vercel.app",
    "https://*.vercel.app/*"
]
allowed_origins.extend(vercel_domains)

# Configure CORS with more permissive settings
CORS(app, 
     origins=allowed_origins,
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in allowed_origins or any(origin.endswith('.vercel.app') for origin in allowed_origins if '*' in origin):
        response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Ensure necessary folders exist
UPLOAD_FOLDER = "uploads"
STATIC_FOLDER = "static"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STATIC_FOLDER, exist_ok=True)

# Predefined commands with actions - Updated to match the chatbot navigation
COMMANDS = {
    "policy": {"action": "navigate", "page": "/user-dashboard", "message": "I'll take you to your policies"},
    "my policy": {"action": "navigate", "page": "/user-dashboard", "message": "I'll take you to your policies"},
    "show policy": {"action": "navigate", "page": "/user-dashboard", "message": "I'll take you to your policies"},
    "claim": {"action": "navigate", "page": "/claims", "message": "I'll take you to the claims section"},
    "claims": {"action": "navigate", "page": "/claims", "message": "I'll take you to the claims section"},
    "file claim": {"action": "navigate", "page": "/claims", "message": "I'll take you to the claims section"},
    "vault": {"action": "navigate", "page": "/vault", "message": "I'll open your vault"},
    "open vault": {"action": "navigate", "page": "/vault", "message": "I'll open your vault"},
    "my vault": {"action": "navigate", "page": "/vault", "message": "I'll open your vault"},
    "health": {"action": "navigate", "page": "/policy/health", "message": "I'll show you health insurance policies"},
    "health policy": {"action": "navigate", "page": "/policy/health", "message": "I'll show you health insurance policies"},
    "health insurance": {"action": "navigate", "page": "/policy/health", "message": "I'll show you health insurance policies"},
    "vehicle": {"action": "navigate", "page": "/policy/vehicle", "message": "I'll show you vehicle insurance policies"},
    "vehicle policy": {"action": "navigate", "page": "/policy/vehicle", "message": "I'll show you vehicle insurance policies"},
    "vehicle insurance": {"action": "navigate", "page": "/policy/vehicle", "message": "I'll show you vehicle insurance policies"},
    "car": {"action": "navigate", "page": "/policy/vehicle", "message": "I'll show you vehicle insurance policies"},
    "car insurance": {"action": "navigate", "page": "/policy/vehicle", "message": "I'll show you vehicle insurance policies"},
    "life": {"action": "navigate", "page": "/policy/life", "message": "I'll show you life insurance policies"},
    "life policy": {"action": "navigate", "page": "/policy/life", "message": "I'll show you life insurance policies"},
    "life insurance": {"action": "navigate", "page": "/policy/life", "message": "I'll show you life insurance policies"},
    "home": {"action": "navigate", "page": "/policy/home", "message": "I'll show you home insurance policies"},
    "home policy": {"action": "navigate", "page": "/policy/home", "message": "I'll show you home insurance policies"},
    "home insurance": {"action": "navigate", "page": "/policy/home", "message": "I'll show you home insurance policies"},
    "travel": {"action": "navigate", "page": "/policy/travel", "message": "I'll show you travel insurance policies"},
    "travel policy": {"action": "navigate", "page": "/policy/travel", "message": "I'll show you travel insurance policies"},
    "travel insurance": {"action": "navigate", "page": "/policy/travel", "message": "I'll show you travel insurance policies"},
    "business": {"action": "navigate", "page": "/policy/business", "message": "I'll show you business insurance policies"},
    "business policy": {"action": "navigate", "page": "/policy/business", "message": "I'll show you business insurance policies"},
    "business insurance": {"action": "navigate", "page": "/policy/business", "message": "I'll show you business insurance policies"},
    "calculator": {"action": "navigate", "page": "/", "message": "I'll take you to the calculator section"},
    "calculate": {"action": "navigate", "page": "/", "message": "I'll take you to the calculator section"},
    "premium": {"action": "navigate", "page": "/", "message": "I'll take you to the calculator section"},
    "main page": {"action": "navigate", "page": "/", "message": "I'll take you to the main page"},
    "home page": {"action": "navigate", "page": "/", "message": "I'll take you to the main page"},
    "contact support": {"action": "response", "message": "You can contact our support team at support@insure.com or call us at 1-800-INSURE"},
    "customer support": {"action": "response", "message": "You can contact our support team at support@insure.com or call us at 1-800-INSURE"},
}

def convert_to_wav(audio_path):
    """Convert audio file to WAV format with PCM encoding."""
    try:
        print(f"🔄 Converting {audio_path} to WAV format...")  # Debugging

        audio = AudioSegment.from_file(audio_path)
        wav_path = os.path.join(UPLOAD_FOLDER, "converted_audio.wav")
        audio.export(wav_path, format="wav", parameters=["-acodec", "pcm_s16le"])  # Ensure PCM format
        
        print(f"✅ Conversion successful: {wav_path}")  # Debugging
        return wav_path
    except Exception as e:
        print(f"❌ Error converting file: {e}")
        return None

def transcribe_audio(audio_path):
    """Convert speech in an audio file to text."""
    print(f"🎙️ Processing file: {audio_path}")  # Debugging
    recognizer = sr.Recognizer()

    # Force conversion to WAV (even if already WAV, this ensures correct format)
    audio_path = convert_to_wav(audio_path)
    if not audio_path:
        return "❌ Audio conversion failed."

    try:
        with sr.AudioFile(audio_path) as source:
            # Adjust for ambient noise
            print("🔊 Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            
            print("🎤 Recording audio...")
            audio_data = recognizer.record(source)
        
        print("🔍 Recognizing speech...")
        transcript = recognizer.recognize_google(audio_data)  # Google Speech API
        print(f"✅ Transcribed: '{transcript}'")  # Debugging
        return transcript
    except sr.UnknownValueError:
        print("❌ Speech could not be recognized - audio may be too quiet or unclear")
        return "❌ Speech could not be recognized. Please speak more clearly and try again."
    except sr.RequestError as e:
        print(f"❌ Speech recognition service error: {e}")
        return "❌ Could not connect to speech recognition service. Please check your internet connection."
    except Exception as e:
        print(f"❌ Unexpected error in speech recognition: {e}")
        return f"❌ Speech recognition error: {str(e)}"

def process_command(transcript):
    """Match transcript with predefined commands and return appropriate action."""
    print(f"🔍 Processing command: '{transcript}'")  # Debug the input
    
    # Check if transcript is an error message
    if "Speech could not be recognized" in transcript or "❌" in transcript:
        print(f"❌ Error message detected: {transcript}")
        return {"type": "response", "message": transcript}
    
    transcript = transcript.lower().strip()
    print(f"🔍 Looking for matches in: '{transcript}'")  # Debug the processed input
    
    # Check for exact matches first
    if transcript in COMMANDS:
        print(f"✅ Exact match found: '{transcript}'")
        value = COMMANDS[transcript]
        if value["action"] == "navigate":
            return {
                "type": "navigation", 
                "destination": value["page"],
                "message": value["message"]
            }
        elif value["action"] == "response":
            return {"type": "response", "message": value["message"]}
    
    # Check for partial matches
    for key, value in COMMANDS.items():
        print(f"🔍 Checking partial match: '{key}' in '{transcript}'")  # Debug each command check
        if key in transcript:  # Allow partial match
            print(f"✅ Partial match found: '{key}' in '{transcript}'")  # Debug successful match
            if value["action"] == "navigate":
                return {
                    "type": "navigation", 
                    "destination": value["page"],
                    "message": value["message"]
                }
            elif value["action"] == "response":
                return {"type": "response", "message": value["message"]}
    
    print(f"❌ No matches found for: '{transcript}'")  # Debug no match
    print(f"🔍 Available commands: {list(COMMANDS.keys())}")  # Debug available commands
    return {"type": "response", "message": "I'm sorry, I couldn't understand your request. Please try saying 'policy', 'claims', 'vault', or 'health insurance'."}

@app.route("/debug-command/<text>")
def debug_command(text):
    """Debug endpoint to test command matching with URL parameter"""
    try:
        result = process_command(text)
        return jsonify({
            "input": text,
            "response": result,
            "available_commands": list(COMMANDS.keys())
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/test-command", methods=["POST", "OPTIONS"])
def test_command():
    """Test endpoint to verify command matching"""
    if request.method == "OPTIONS":
        return jsonify({"status": "preflight"}), 200
        
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
            
        text = data['text']
        result = process_command(text)
        return jsonify({"response": result})
    except Exception as e:
        print(f"❌ Error in test-command: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/voice-command", methods=["POST", "OPTIONS"])
def voice_command():
    """Handles voice commands by processing uploaded audio."""
    if request.method == "OPTIONS":
        return jsonify({"status": "preflight"}), 200
        
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty file"}), 400

    try:
        # Extract file extension
        file_ext = os.path.splitext(file.filename)[1]
        if not file_ext:
            return jsonify({"error": "Invalid file format"}), 400

        # Save uploaded file with extension
        temp_audio_path = os.path.join(UPLOAD_FOLDER, f"received_audio{file_ext}")
        file.save(temp_audio_path)

        print(f"📂 File saved: {temp_audio_path}")  # Debugging

        # Convert speech to text
        transcript = transcribe_audio(temp_audio_path)

        print(f"✅ Received transcript: {transcript}")  # Debugging

        # Process the command
        result = process_command(transcript)
        return jsonify({"response": result})

    except Exception as e:
        print(f"❌ Error processing voice command: {e}")  # Log the actual error
        return jsonify({"error": "Failed to process command"}), 500


@app.route("/get-audio/<filename>")
def get_audio(filename):
    """Serves the generated audio file to the frontend."""
    audio_path = os.path.join(STATIC_FOLDER, filename)
    if os.path.exists(audio_path):
        return send_file(audio_path, mimetype="audio/mp3")
    return jsonify({"error": "File not found"}), 404

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "voice-navigation"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True) 