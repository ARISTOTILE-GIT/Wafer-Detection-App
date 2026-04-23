import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:7860";

export const api = axios.create({
  baseURL,
  timeout: 120000
});

export interface PredictResult {
  defect_type:  string;
  confidence:   number;
  all_probs:    Record<string, number>;
  yield_pct:    number;
  decision:     "SAVE" | "REVIEW" | "SCRAP";
  defect_ratio: number;
}

export interface YieldPoint { die_area: number; yield_pct: number; }

export interface ChatMessage { role: "user" | "assistant"; content: string; }

export interface ChatRequest {
  message: string;
  context: {
    defect_type: string;
    confidence:  number;
    yield_pct:   number;
    decision:    string;
  };
  history: ChatMessage[];
}

export async function predictImage(file: File, dieArea: number): Promise<PredictResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("die_area", String(dieArea));
  const { data } = await api.post<PredictResult>("/predict", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function predictDraw(imageBase64: string, dieArea: number): Promise<PredictResult> {
  const { data } = await api.post<PredictResult>("/predict-draw", {
    image_base64: imageBase64,
    die_area:     dieArea
  });
  return data;
}

export async function explain(params: {
  defect_type: string; confidence: number; yield_pct: number; decision: string;
}): Promise<string> {
  const { data } = await api.post<{ explanation: string }>("/explain", params);
  return data.explanation;
}

export async function chat(req: ChatRequest): Promise<string> {
  const { data } = await api.post<{ reply: string }>("/chat", req);
  return data.reply;
}

export async function yieldCurve(defectRatio: number): Promise<YieldPoint[]> {
  const { data } = await api.post<{ points: YieldPoint[] }>("/yield-curve", {
    defect_ratio: defectRatio
  });
  return data.points;
}
