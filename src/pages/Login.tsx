import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/client";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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
      setError(err?.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#0F0E1A",
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* Left Panel - Visual */}
      <div style={{
        flex: "0 0 45%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px",
        background: "linear-gradient(145deg, #1a1040 0%, #2d1b69 40%, #4c2899 70%, #6d28d9 100%)"
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(139,92,246,0.15)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "rgba(109,40,217,0.2)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "30%", width: 200, height: 200, borderRadius: "50%", background: "rgba(167,139,250,0.1)", filter: "blur(30px)" }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.3rem"
            }}>🔬</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.3px" }}>Wafer Defect System</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>AI-Powered Inspection</div>
            </div>
          </div>
        </div>

        {/* Center visual content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          {/* Wafer visualization */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 32 }}>
            <div style={{
              width: 180, height: 180, borderRadius: "50%",
              background: "conic-gradient(from 0deg, #6d28d9, #8b5cf6, #a78bfa, #4c2899, #6d28d9)",
              padding: 3,
              boxShadow: "0 0 60px rgba(109,40,217,0.5), 0 0 120px rgba(109,40,217,0.2)"
            }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: "50%",
                background: "#1a1040",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 6
              }}>
                <div style={{ fontSize: "3rem" }}>💠</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase" }}>Silicon Wafer</div>
              </div>
            </div>
            {/* Orbiting dots */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div key={i} style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: 8, height: 8, borderRadius: "50%",
                background: i % 2 === 0 ? "#a78bfa" : "#7c3aed",
                transform: `rotate(${deg}deg) translate(100px) rotate(-${deg}deg)`,
                marginTop: -4, marginLeft: -4,
                boxShadow: "0 0 8px rgba(167,139,250,0.8)"
              }} />
            ))}
          </div>

          <h2 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            AI-Driven<br />Defect Detection
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>
            EfficientNet-B3 · Murphy Yield Model<br />LLM Expert Analysis · Groq Powered
          </p>
        </div>

        {/* Bottom stats */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 16 }}>
          {[
            { label: "Defect Classes", value: "9" },
            { label: "Model Accuracy", value: "95%+" },
            { label: "Yield Model", value: "Murphy" }
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, background: "rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "10px 12px",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ color: "#a78bfa", fontSize: "1rem", fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.65rem", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        background: "#0F0E1A"
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              color: "#fff", fontSize: "2rem", fontWeight: 800,
              margin: "0 0 8px", letterSpacing: "-0.5px"
            }}>
              Welcome back
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", margin: 0 }}>
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@wafer.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: "100%", padding: "14px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, color: "#fff",
                  fontSize: "0.9rem", outline: "none",
                  transition: "border 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%", padding: "14px 48px 14px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12, color: "#fff",
                    fontSize: "0.9rem", outline: "none",
                    boxSizing: "border-box"
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    color: "rgba(255,255,255,0.4)", cursor: "pointer",
                    fontSize: "0.85rem", padding: 4
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10, padding: "10px 14px",
                color: "#FCA5A5", fontSize: "0.83rem", display: "flex", alignItems: "center", gap: 8
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "rgba(109,40,217,0.5)" : "linear-gradient(135deg, #4c2899, #6d28d9, #8b5cf6)",
                border: "none", borderRadius: 12,
                color: "#fff", fontSize: "0.95rem", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 4,
                boxShadow: loading ? "none" : "0 4px 24px rgba(109,40,217,0.4)",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                letterSpacing: "0.3px"
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block"
                  }} />
                  Signing in…
                </>
              ) : "Sign In →"}
            </button>
          </form>

          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", textAlign: "center", marginTop: 32 }}>
            © 2026 Wafer Defect Detection System · Bethlahem Institute of Engineering
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>
    </div>
  );
}
