from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.linear_model import LinearRegression
import numpy as np
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Connect to MySQL database
def get_db_connection():
    return pymysql.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASS', 'root'), # default for docker setup
        database=os.getenv('DB_NAME', 'nexcart'),
        cursorclass=pymysql.cursors.DictCursor
    )

def fetch_products():
    connection = get_db_connection()
    query = """
        SELECT p.id, p.name, p.description, c.name as category, p.brand 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
    """
    df = pd.read_sql(query, connection)
    connection.close()
    return df

def generate_recommendations(product_id, num_recommendations=5):
    df = fetch_products()
    if df.empty:
        return []

    # Combine text features for content-based filtering
    df['content'] = df['name'].fillna('') + ' ' + df['description'].fillna('') + ' ' + df['category'].fillna('') + ' ' + df['brand'].fillna('')

    # TF-IDF Vectorization
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['content'])

    # Compute Cosine Similarity (Linear Kernel)
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    # Get index of the product
    try:
        idx = df.index[df['id'] == product_id].tolist()[0]
    except IndexError:
        return [] # Product not found

    # Get pairwise similarity scores
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the products based on similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the most similar products (excluding itself)
    sim_scores = sim_scores[1:num_recommendations+1]

    # Get the product indices
    product_indices = [i[0] for i in sim_scores]

    # Return top similar product IDs
    return df['id'].iloc[product_indices].tolist()

@app.route('/api/recommendations/<int:product_id>', methods=['GET'])
def get_recommendations(product_id):
    try:
        recommended_ids = generate_recommendations(product_id)
        return jsonify({
            'product_id': product_id,
            'recommended_product_ids': recommended_ids
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict-demand', methods=['GET'])
def predict_demand():
    try:
        # Generate past 12 weeks of historical sales data
        weeks = np.array(range(1, 13)).reshape(-1, 1)
        base_sales = np.array([50, 55, 52, 60, 65, 62, 70, 75, 71, 80, 85, 90])
        noise = np.random.normal(0, 5, 12)
        historical_sales = base_sales + noise

        # Train Linear Regression model
        model = LinearRegression()
        model.fit(weeks, historical_sales)

        # Predict next 4 weeks
        future_weeks = np.array(range(13, 17)).reshape(-1, 1)
        predictions = model.predict(future_weeks)

        # Format output
        historical_data = [{"week": f"Week {i+1}", "sales": round(val)} for i, val in enumerate(historical_sales)]
        forecast_data = [{"week": f"Week {i+13} (Forecast)", "predicted_sales": round(val)} for i, val in enumerate(predictions)]

        return jsonify({
            "status": "success",
            "historical": historical_data,
            "forecast": forecast_data,
            "trend": "Upward" if model.coef_[0] > 0 else "Downward",
            "growth_rate": round(model.coef_[0], 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
