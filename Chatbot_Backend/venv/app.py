import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import logging
from typing import Tuple, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Broader CORS configuration

class FAQChatBot:
    """FAQ Chatbot using TF-IDF and cosine similarity"""
    
    def __init__(self, csv_path: str):
        self.faq_df = self._load_data(csv_path)
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self._train_model()
        
    def _load_data(self, csv_path: str) -> pd.DataFrame:
        """Load and preprocess FAQ data"""
        try:
            df = pd.read_csv(csv_path)
            # Basic data validation
            assert not df.empty, "Dataset is empty"
            assert 'Question' in df.columns and 'Answer' in df.columns, "Missing required columns"
            
            # Clean data
            df = df.dropna(subset=['Question', 'Answer'])
            df['Question'] = df['Question'].str.strip().str.lower()
            return df
            
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            raise

    def _train_model(self):
        """Train the TF-IDF model"""
        questions = self.faq_df["Question"].tolist()
        self.tfidf_matrix = self.vectorizer.fit_transform(questions)
        
    def find_best_match(self, user_query: str, threshold: float = 0.2) -> Tuple[str, float]:
        """Find the best matching FAQ answer with confidence score"""
        try:
            query_vec = self.vectorizer.transform([user_query.lower().strip()])
            similarity_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
            
            best_match_idx = np.argmax(similarity_scores)
            confidence = similarity_scores[best_match_idx]
            
            if confidence > threshold:
                return self.faq_df.iloc[best_match_idx]["Answer"], float(confidence)
            return "I'm sorry, I don't have an answer for that. Please contact our support team.", 0.0
            
        except Exception as e:
            logger.error(f"Error finding match: {str(e)}")
            return "I encountered an error processing your request.", 0.0

# Initialize chatbot
try:
    chatbot = FAQChatBot("insurance_dataset.csv")
    logger.info("FAQ Chatbot initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize chatbot: {str(e)}")
    raise

@app.route("/api/chat", methods=["POST"])
def handle_chat():
    """Handle chat requests"""
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({"error": "Invalid request format"}), 400
            
        user_query = data['query'].strip()
        if not user_query:
            return jsonify({"error": "Empty query"}), 400
            
        response, confidence = chatbot.find_best_match(user_query)
        
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
    app.run(host="0.0.0.0", port=5000, debug=False)  # debug=False in production