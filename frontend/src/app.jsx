import { useState, useEffect } from "react";

const EXAMPLES = [
  { label: "💰 Prize", text: "URGENT! Your mobile number has won a £2000 prize. Call 09061701461 to claim now. Terms apply." },
  { label: "📦 Delivery", text: "The delivery of your parcel is pending. Please verify your address at http://bit.ly/fake-parcel-service" },
  { label: "🔒 Security", text: "Your Amazon account has been locked. Log in here to secure it: http://secure-amazon-update.com" },
  { label: "☕ Ham", text: "Hey! Are you coming to the coffee shop later? I'm already here with the laptop." },
  { label: "🔑 2FA", text: "Your verification code for Google is 482910. Do not share this with anyone." },
];

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch("/metrics").then(res => res.json()).then(setMetrics).catch(() => {});
  }, []);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={container}>
      <h1 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>🛡️ Spam Shield Pro</h1>
      <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px' }}>AI Consensus Verification System</p>
      
      <div style={exampleRow}>
        {EXAMPLES.map(ex => (
          <button key={ex.label} onClick={() => setText(ex.text)} style={pill}>{ex.label}</button>
        ))}
      </div>

      <textarea 
        style={textarea}
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Input text for analysis..."
      />
      
      <button onClick={analyze} disabled={loading} style={mainBtn}>
        {loading ? "Crunching Data..." : "Analyze with Dual-AI Consensus"}
      </button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          {/* Final Verdict Banner */}
          <div style={{ 
            textAlign: 'center', padding: '20px', borderRadius: '12px', marginBottom: '20px',
            background: result.verdict === 'spam' ? '#fee2e2' : result.verdict === 'ham' ? '#dcfce7' : '#fef3c7',
            border: '2px solid',
            borderColor: result.verdict === 'spam' ? '#ef4444' : result.verdict === 'ham' ? '#22c55e' : '#f59e0b'
          }}>
            <h2 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Verdict: {result.verdict}
            </h2>
            {result.disagreement && <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#92400e' }}>⚠️ Models show conflicting signals</p>}
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <ModelCard title="SVM (Geometric Analysis)" data={result.svm} />
            <ModelCard title="Naive Bayes (Probabilistic)" data={result.nb} />
          </div>
        </div>
      )}

      {metrics && (
        <div style={footer}>
            <p>Model Precision: SVM ({(metrics.svm * 100).toFixed(1)}%) | NB ({(metrics.nb * 100).toFixed(1)}%)</p>
        </div>
      )}
    </div>
  );
}

function ModelCard({ title, data }) {
  const isSpam = data.label === "spam";
  return (
    <div style={{ ...card, borderColor: isSpam ? "#f87171" : "#4ade80", background: "#fff" }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#64748b' }}>{title}</h3>
      <div style={{ fontSize: "1.5rem", fontWeight: "800", color: isSpam ? "#dc2626" : "#16a34a" }}>
        {data.label.toUpperCase()}
      </div>
      <p style={{ margin: '10px 0 5px 0', fontSize: '0.9rem' }}>Confidence: {(data.conf * 100).toFixed(2)}%</p>
      <div style={meterBg}>
        <div style={{ ...meterFill, width: `${data.conf * 100}%`, backgroundColor: isSpam ? "#f87171" : "#4ade80" }} />
      </div>
    </div>
  );
}

const container = { maxWidth: '750px', margin: '40px auto', padding: '20px', fontFamily: 'Inter, system-ui, sans-serif' };
const exampleRow = { display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' };
const pill = { padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', background: '#fff', fontSize: '0.8rem' };
const textarea = { width: '100%', height: '120px', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' };
const mainBtn = { width: '100%', marginTop: '15px', padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };
const card = { padding: "20px", borderRadius: "12px", border: "1px solid", boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };
const meterBg = { width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' };
const meterFill = { height: '100%', transition: 'width 1s ease-in-out' };
const footer = { textAlign: 'center', marginTop: '40px', color: '#94a3b8', fontSize: '0.7rem' };