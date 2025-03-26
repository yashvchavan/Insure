import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "*"}})

def load_faq(csv_path):
    """Load the FAQ data from a CSV file."""
    return pd.read_csv(csv_path)

def find_best_match(user_query, faq_df):
    """Find the best matching FAQ answer using TF-IDF vectorization and cosine similarity."""
    questions = faq_df["Question"].tolist()
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(questions + [user_query])
    similarity_scores = cosine_similarity(vectors[-1], vectors[:-1]).flatten()
    best_match_index = similarity_scores.argmax()
    
    if similarity_scores[best_match_index] > 0.2:  # Threshold to ensure relevance
        return faq_df.loc[best_match_index, "Answer"]
    else:
        return "I'm sorry, I don't have an answer for that. Please contact our support team."

faq_df = load_faq("insurance_dataset.csv")

@app.route("/chat", methods=["POST"])
def chatbot():
    data = request.get_json()
    user_query = data.get("query", "")
    response = find_best_match(user_query, faq_df)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
