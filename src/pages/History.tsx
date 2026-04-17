import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ReferenceLine
} from "recharts";
import PageHeader from "../components/PageHeader";
import { useHistory } from "../context/HistoryContext";

const PURPLE_PALETTE = ["#6D28D9","#3730A3","#7C3AED","#A78BFA","#C4B5FD","#DDD6FE","#EDE9FE","#F5F3FF","#8B5CF6"];
const DECISION_COLORS: Record<string, string> = { SAVE: "#10B981", REVIEW: "#F59E0B", SCRAP: "#EF4444" };

export default function History() {
  const { history } = useHistory();

  const downloadCsv = () => {
    if (!history.length) return;
    const headers = ["Timestamp","Wafer ID","Defect","Confidence (%)","Yield (%)","Decision"];
    const rows = history.map(h => [h.timestamp, h.waferId, h.defect, h.confidence, h.yieldPct, h.decision].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "wafer_history.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (!history.length) {
    return (
      <>
        <PageHeader title="Prediction History" subtitle="Session log of all wafer inspections" />
        <div className="card"><div className="empty-state">No history yet — run some predictions first.</div></div>
      </>
    );
  }

  // Pie: defect distribution
  const defectCounts: Record<string, number> = {};
  history.forEach(h => { defectCounts[h.defect] = (defectCounts[h.defect] || 0) + 1; });
  const pieData = Object.entries(defectCounts).map(([name, value]) => ({ name, value }));

  // Bar: decision distribution
  const decCounts: Record<string, number> = {};
  history.forEach(h => { decCounts[h.decision] = (decCounts[h.decision] || 0) + 1; });
  const decData = Object.entries(decCounts).map(([decision, count]) => ({ decision, count }));

  // Yield trend
  const trendData = history.map((h, i) => ({ idx: i + 1, yieldPct: h.yieldPct }));

  return (
    <>
      <PageHeader title="Prediction History" subtitle={`${history.length} inspections recorded`} />

      <div className="table-wrap mt-1">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th><th>Wafer ID</th><th>Defect</th>
              <th>Confidence</th><th>Yield</th><th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {history.slice().reverse().map((h, i) => (
              <tr key={i}>
                <td style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#64748B" }}>{h.timestamp}</td>
                <td><strong>{h.waferId}</strong></td>
                <td>{h.defect}</td>
                <td>{h.confidence.toFixed(1)}%</td>
                <td>{h.yieldPct}%</td>
                <td><span className={`cell-decision ${h.decision}`}>{h.decision}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2">
        <button className="btn btn-ghost" onClick={downloadCsv}>⬇️ Download CSV</button>
      </div>

      <div className="grid-2 grid-2-even mt-3">
        <div className="card">
          <div className="card-title">Defect Distribution</div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45}
                     labelLine={false} label={(e: any) => `${e.name} ${(e.percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={PURPLE_PALETTE[i % PURPLE_PALETTE.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Decision Breakdown</div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={decData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="decision" tick={{ fontSize: 12, fill: "#334155" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {decData.map((d, i) => <Cell key={i} fill={DECISION_COLORS[d.decision] || "#94A3B8"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Yield Trend</div>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="idx" tick={{ fontSize: 11, fill: "#64748B" }} label={{ value: "Prediction #", position: "insideBottom", offset: -2, fontSize: 11, fill: "#64748B" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <ReferenceLine y={70} stroke="#10B981" strokeDasharray="4 4" />
              <ReferenceLine y={40} stroke="#F59E0B" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="yieldPct" stroke="#6D28D9" strokeWidth={2.5} dot={{ r: 4, fill: "#6D28D9" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
