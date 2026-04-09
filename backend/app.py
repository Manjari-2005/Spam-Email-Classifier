from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, string, json

app = Flask(__name__)
CORS(app)

# Load Models
v = joblib.load("vectorizer.joblib")
m_svm = joblib.load("svm.joblib")
m_nb = joblib.load("naive_bayes.joblib")

@app.route("/classify", methods=["POST"])
def classify():
    text = request.json.get("text", "")
    clean = text.lower().translate(str.maketrans("", "", string.punctuation))
    vec = v.transform([clean])
    
    # SVM Prediction
    p_svm = int(m_svm.predict(vec)[0])
    c_svm = float(m_svm.predict_proba(vec)[0][p_svm])
    
    # Naive Bayes Prediction
    p_nb = int(m_nb.predict(vec)[0])
    c_nb = float(m_nb.predict_proba(vec)[0][p_nb])

    # Consensus Logic: SVM is generally more accurate for this task
    final_verdict = "spam" if p_svm == 1 else "ham"
    
    # If they disagree, and SVM confidence is low, mark as Uncertain
    if p_svm != p_nb and c_svm < 0.85:
        final_verdict = "uncertain"

    return jsonify({
        "verdict": final_verdict,
        "disagreement": p_svm != p_nb,
        "svm": {"label": "spam" if p_svm else "ham", "conf": c_svm},
        "nb": {"label": "spam" if p_nb else "ham", "conf": c_nb}
    })

@app.route("/metrics")
def metrics():
    with open("metrics.json") as f: return jsonify(json.load(f))

if __name__ == "__main__":
    app.run(debug=True, port=5000)