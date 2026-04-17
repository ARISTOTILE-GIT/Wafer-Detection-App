import { NavLink } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";
import "./Sidebar.css";

interface Props {
  waferId:  string;
  dieArea:  number;
  onWaferIdChange: (v: string) => void;
  onDieAreaChange: (v: number) => void;
}

export default function Sidebar({ waferId, dieArea, onWaferIdChange, onDieAreaChange }: Props) {
  const { history, clear } = useHistory();
  const total = history.length;
  const saves     = history.filter(h => h.decision === "SAVE").length;
  const reviews   = history.filter(h => h.decision === "REVIEW").length;
  const scraps    = history.filter(h => h.decision === "SCRAP").length;
  const avgYield  = total ? (history.reduce((s, h) => s + h.yieldPct, 0) / total).toFixed(2) : "0";

  const links = [
    { to: "/",        label: "Prediction",    icon: "🔍" },
    { to: "/draw",    label: "Draw Mode",     icon: "🎨" },
    { to: "/yield",   label: "Yield Analysis", icon: "📈" },
    { to: "/history", label: "History",       icon: "📋" }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">🔬</div>
        <div>
          <div className="brand-title">Wafer Defect System</div>
          <div className="brand-sub">EfficientNet-B3 · Murphy Yield</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"} className="nav-link">
            <span className="nav-icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-section">
        <p className="section-label">Wafer Config</p>
        <div className="field">
          <label>Wafer ID</label>
          <input
            type="text"
            value={waferId}
            onChange={e => onWaferIdChange(e.target.value)}
          />
        </div>
        <div className="field field-range">
          <label>
            Die Area (cm²) <span className="range-value">{dieArea.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={0.1} max={2.0} step={0.1}
            value={dieArea}
            onChange={e => onDieAreaChange(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="sidebar-section">
        <p className="section-label">Session Stats</p>
        {total > 0 ? (
          <>
            <div className="pill"><span>Total Wafers</span><strong>{total}</strong></div>
            <div className="pill"><span>Avg Yield</span><strong>{avgYield}%</strong></div>
            <div className="pill"><span>✅ Save</span><strong style={{color:"#6EE7B7"}}>{saves}</strong></div>
            <div className="pill"><span>⚠️ Review</span><strong style={{color:"#FCD34D"}}>{reviews}</strong></div>
            <div className="pill"><span>❌ Scrap</span><strong style={{color:"#FCA5A5"}}>{scraps}</strong></div>
            <button className="btn btn-danger btn-block mt-2" onClick={clear}>
              Clear History
            </button>
          </>
        ) : (
          <p className="empty-sub">No predictions yet</p>
        )}
      </div>
    </aside>
  );
}
