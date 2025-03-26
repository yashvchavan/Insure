import os
import json
import speech_recognition as sr
from flask import Flask, request, jsonify, send_file
from gtts import gTTS
import tempfile
from flask_cors import CORS
from pydub import AudioSegment


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Ensure necessary folders exist
UPLOAD_FOLDER = "uploads"
STATIC_FOLDER = "static"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STATIC_FOLDER, exist_ok=True)

# Predefined commands with actions
COMMANDS = {
    "show health insurance policy": {"action": "navigate", "page": "/health-insurance"},
    "show car insurance policy": {"action": "navigate", "page": "/car-insurance"},
    "contact customer support": {"action": "response", "message": "Redirecting you to customer support."},
    "file a claim": {"action": "navigate", "page": "/claims"},
    "compare policies": {"action": "navigate", "page": "/compare-policies"},
    "show my active policies": {"action": "navigate", "page": "/my-policies"},
    "get insurance quotes": {"action": "navigate", "page": "/get-quote"},
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
            audio_data = recognizer.record(source)
        
        transcript = recognizer.recognize_google(audio_data)  # Google Speech API
        print(f"✅ Transcribed: {transcript}")  # Debugging
        return transcript
    except sr.UnknownValueError:
        return "Speech could not be recognized."
    except sr.RequestError:
        return "Could not connect to speech recognition service."

def process_command(transcript):
    """Match transcript with predefined commands and return appropriate action."""
    transcript = transcript.lower()
    for key, value in COMMANDS.items():
        if key in transcript:  # Allow partial match
            if value["action"] == "navigate":
                return {"type": "navigation", "destination": value["page"]}
            elif value["action"] == "response":
                return {"type": "response", "message": value["message"]}
    return {"type": "response", "message": "I'm sorry, I couldn't understand your request."}

@app.route("/voice-command", methods=["POST"])
def voice_command():
    """Handles voice commands by processing uploaded audio."""
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

if __name__ == "__main__":
    app.run(debug=True)
