import csv
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from typing import Tuple
import json
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Get the frontend URL from environment variable
prod_frontend_url = os.environ.get("FRONTEND_URL")

# Define allowed origins - include common Vercel domains
allowed_origins = [
    "http://localhost:3000",
    "https://localhost:3000"
]

# Add production frontend URL if provided
if prod_frontend_url:
    allowed_origins.append(prod_frontend_url)

# Add common Vercel domains
vercel_domains = [
    "https://*.vercel.app",
    "https://*.vercel.app/*"
]
allowed_origins.extend(vercel_domains)

# Configure CORS with more permissive settings for development
CORS(app, 
     resources={r"/*": {"origins": allowed_origins}},
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin:
        # Allow any Vercel domain
        if origin.endswith('.vercel.app') or origin in allowed_origins:
            response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Add root endpoint to handle 404 errors
@app.route("/", methods=["GET", "OPTIONS"])
def root():
    """Root endpoint"""
    if request.method == "OPTIONS":
        return jsonify({"status": "preflight"}), 200
    return jsonify({
        "message": "InsureEase Chatbot API",
        "status": "running",
        "endpoints": {
            "health": "/api/health",
            "chat": "/api/chat"
        }
    }), 200

class UltraSimpleFAQChatBot:
    """Ultra-simple FAQ Chatbot using basic keyword matching"""
    
    def __init__(self, csv_path: str):
        self.faq_data = self._load_data(csv_path)
        self._create_keyword_index()
        
    def _load_data(self, csv_path: str) -> list:
        """Load FAQ data using standard CSV module"""
        try:
            faq_data = []
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    if 'Question' in row and 'Answer' in row and row['Question'] and row['Answer']:
                        faq_data.append({
                            'question': row['Question'].strip().lower(),
                            'answer': row['Answer'].strip()
                        })
            
            if not faq_data:
                raise ValueError("No valid FAQ data found")
                
            logger.info(f"Loaded {len(faq_data)} FAQ entries")
            return faq_data
            
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            raise

    def _create_keyword_index(self):
        """Create a simple keyword index for matching"""
        self.keyword_index = {}
        
        for idx, entry in enumerate(self.faq_data):
            question = entry['question']
            words = question.split()
            
            for word in words:
                # Clean word and only consider meaningful words
                clean_word = ''.join(c for c in word if c.isalnum()).lower()
                if len(clean_word) > 3:  # Only consider words longer than 3 characters
                    if clean_word not in self.keyword_index:
                        self.keyword_index[clean_word] = []
                    self.keyword_index[clean_word].append(idx)
        
    def find_best_match(self, user_query: str, threshold: float = 0.2) -> Tuple[str, float]:
        """Find the best matching FAQ answer using simple keyword matching"""
        user_query = user_query.lower().strip()
        user_words = user_query.split()
        
        # Score each FAQ entry based on keyword matches
        scores = {}
        
        for word in user_words:
            # Clean word
            clean_word = ''.join(c for c in word if c.isalnum()).lower()
            if len(clean_word) > 3 and clean_word in self.keyword_index:
                for idx in self.keyword_index[clean_word]:
                    if idx not in scores:
                        scores[idx] = 0
                    scores[idx] += 1
        
        if not scores:
            return "I'm sorry, I don't have an answer for that. Please contact our support team.", 0.0
        
        # Find the entry with the highest score
        best_idx = max(scores, key=scores.get)
        best_score = scores[best_idx]
        
        # Calculate confidence (normalize by number of words in user query)
        confidence = min(best_score / len(user_words), 1.0)
        
        if confidence > threshold:
            return self.faq_data[best_idx]["answer"], float(confidence)
        
        return "I'm sorry, I don't have an answer for that. Please contact our support team.", 0.0

# Initialize chatbot
try:
    chatbot = UltraSimpleFAQChatBot("insurance_dataset.csv")
    logger.info("Ultra-simple FAQ Chatbot initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize chatbot: {str(e)}")
    raise

@app.route("/api/chat", methods=["POST", "OPTIONS"])
def handle_chat():
    """Handle chat requests"""
    if request.method == "OPTIONS":
        response = jsonify({"status": "preflight"})
        return response
        
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({"error": "Invalid request format"}), 400
            
        user_query = data['query'].strip()
        if not user_query:
            return jsonify({"error": "Empty query"}), 400
            
        logger.info(f"Received query: {user_query}")
        
        response, confidence = chatbot.find_best_match(user_query)
        
        logger.info(f"Response: {response[:100]}... (confidence: {confidence})")
        
        # Parse the response if it's JSON (for navigation)
        try:
            response_data = json.loads(response)
            return jsonify(response_data)
        except json.JSONDecodeError:
            return jsonify({
                "response": response,
                "confidence": confidence,
                "status": "success"
            })
            
    except Exception as e:
        logger.error(f"Error handling request: {str(e)}")
        return jsonify({
            "response": "Sorry, I encountered an error processing your request.",
            "status": "error"
        }), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True) 