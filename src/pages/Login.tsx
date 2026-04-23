import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/client";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const { token, user } = await login(email, password);
      localStorage.setItem("wafer_token", token);
      localStorage.setItem("wafer_user", JSON.stringify(user));
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1E1B4B 0%, #3730A3 60%, #6D28D9 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 24px 64px rgba(0,0,0,0.3)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🔬</div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1E1B4B", margin: 0 }}>
            Wafer Defect System
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: 6 }}>
            EfficientNet-B3 · Murphy Yield · LLM Analysis
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@wafer.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div className="field" style={{ marginBottom: 20 }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>

          {error && (
            <p style={{ color: "#B91C1C", fontSize: "0.85rem", marginBottom: 12, textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ fontSize: "0.95rem", padding: "12px" }}
          >
            {loading ? <><span className="spinner" /> Signing in…</> : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#94A3B8", fontSize: "0.75rem", marginTop: 20 }}>
          © 2026 Wafer Defect Detection System
        </p>
      </div>
    </div>
  );
}
