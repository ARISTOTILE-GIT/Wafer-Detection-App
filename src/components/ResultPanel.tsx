import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from "recharts";
import type { PredictResult } from "../api/client";
import { explain } from "../api/client";

interface Props { result: PredictResult; }

const decisionColor: Record<string, string> = {
  SAVE:   "#10B981",
  REVIEW: "#F59E0B",
  SCRAP:  "#EF4444"
};

export default function ResultPanel({ result }: Props) {
  const [expl, setExpl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setExpl(""); setErr(null); setLoading(true);
    explain({
      defect_type: result.defect_type,
      confidence:  result.confidence,
      yield_pct:   result.yield_pct,
      decision:    result.decision
    })
      .then(text => { if (!cancelled) setExpl(text); })
      .catch(e => { if (!cancelled) setErr(e?.response?.data?.detail || "Expert analysis unavailable."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [result]);

  const probData = Object.entries(result.all_probs)
    .map(([cls, p]) => ({ cls, p }))
    .sort((a, b) => a.p - b.p);

  const barColor = decisionColor[result.decision];
  const badgeCls = `badge badge-${result.decision.toLowerCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card"
    >
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="card-title">Prediction Result</div>
        <span className={badgeCls}>
          {result.decision === "SAVE" ? "✅" : result.decision === "REVIEW" ? "⚠️" : "❌"} {result.decision}
        </span>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="m-label">Defect Type</div>
          <div className="m-value" style={{ fontSize: "1rem" }}>{result.defect_type}</div>
        </div>
        <div className="metric-card">
          <div className="m-label">Confidence</div>
          <div className="m-value">{result.confidence.toFixed(1)}%</div>
        </div>
        <div className="metric-card">
          <div className="m-label">Murphy Yield</div>
          <div className="m-value">{result.yield_pct}%</div>
        </div>
      </div>

      {/* Yield progress bar */}
      <div style={{ marginTop: 6 }}>
        <div style={{
          background: "#E2E8F0",
          borderRadius: 10,
          height: 14,
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{
            width: `${result.yield_pct}%`,
            height: "100%",
            background: barColor,
            transition: "width 0.35s ease"
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748B", marginTop: 4 }}>
          <span>0%</span><span style={{color:"#F59E0B"}}>40%</span><span style={{color:"#10B981"}}>70%</span><span>100%</span>
        </div>
      </div>

      {/* Class probabilities */}
      <div className="mt-3">
        <div className="card-title">Class Probabilities</div>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart
              data={probData}
              layout="vertical"
              margin={{ top: 4, right: 20, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis dataKey="cls" type="category" tick={{ fontSize: 11, fill: "#334155" }} width={70} />
              <Tooltip
                formatter={(v: number) => `${v}%`}
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
              />
              <Bar dataKey="p" radius={[0, 6, 6, 0]}>
                {probData.map((d, i) => (
                  <Cell key={i} fill={d.cls === result.defect_type ? "#6D28D9" : "#CBD5E1"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expert analysis */}
      <div className="mt-3">
        <div className="card-title">Expert Analysis</div>
        {loading && <p style={{ color: "#64748B", fontSize: "0.85rem" }}>Fetching expert analysis…</p>}
        {err && <p style={{ color: "#B91C1C", fontSize: "0.85rem" }}>{err}</p>}
        {expl && <div className="expert-box">{expl}</div>}
      </div>
    </motion.div>
  );
}
