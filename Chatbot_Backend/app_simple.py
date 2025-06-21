import pandas as pd
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
     resources={r"/api/*": {"origins": allowed_origins}},
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

class SimpleFAQChatBot:
    """Simple FAQ Chatbot using keyword matching"""
    
    def __init__(self, csv_path: str):
        self.faq_df = self._load_data(csv_path)
        self._create_keyword_index()
        
    def _load_data(self, csv_path: str) -> pd.DataFrame:
        """Load and preprocess FAQ data"""
        try:
            df = pd.read_csv(csv_path)
            assert not df.empty, "Dataset is empty"
            assert 'Question' in df.columns and 'Answer' in df.columns, "Missing required columns"
            
            df = df.dropna(subset=['Question', 'Answer'])
            df['Question'] = df['Question'].str.strip().str.lower()
            return df
            
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            raise

    def _create_keyword_index(self):
        """Create a simple keyword index for matching"""
        self.keyword_index = {}
        
        for idx, row in self.faq_df.iterrows():
            question = row['Question'].lower()
            words = question.split()
            
            for word in words:
                if len(word) > 3:  # Only consider words longer than 3 characters
                    if word not in self.keyword_index:
                        self.keyword_index[word] = []
                    self.keyword_index[word].append(idx)
        
    def find_best_match(self, user_query: str, threshold: float = 0.2) -> Tuple[str, float]:
        """Find the best matching FAQ answer using keyword matching"""
        user_query = user_query.lower().strip()
        user_words = user_query.split()
        
        # Score each FAQ entry based on keyword matches
        scores = {}
        
        for word in user_words:
            if len(word) > 3 and word in self.keyword_index:
                for idx in self.keyword_index[word]:
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
            return self.faq_df.iloc[best_idx]["Answer"], float(confidence)
        
        return "I'm sorry, I don't have an answer for that. Please contact our support team.", 0.0

# Initialize chatbot
try:
    chatbot = SimpleFAQChatBot("insurance_dataset.csv")
    logger.info("Simple FAQ Chatbot initialized successfully")
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
            
        response, confidence = chatbot.find_best_match(user_query)
        
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