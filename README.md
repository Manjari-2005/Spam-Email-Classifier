🛡️ Spam Shield Pro
A full-stack AI consensus system that uses Dual-Model Verification to classify spam with high precision.

⚡ Quick Start
Backend:

Bash
cd backend
pip install -r requirements.txt
python train.py  # Generates models
python app.py    # Starts API
Frontend:

Bash
cd frontend
npm install --legacy-peer-deps
npm run dev
🧠 How it Works
This system compares two different AI architectures to ensure a "Consensus Verdict":

Linear SVM: A geometric model that identifies the boundary between ham and spam.

Naive Bayes: A probabilistic model that counts keyword frequencies.

If the models disagree, the UI returns an UNCERTAIN verdict, preventing false positives.

🛠️ Tech Stack
ML: Scikit-Learn, Pandas, Joblib

Backend: Flask, Python

Frontend: React, Vite 8