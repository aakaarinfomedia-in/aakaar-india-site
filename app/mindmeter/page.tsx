"use client";

import { useState, useEffect } from "react";

export default function MindMeter() {
  const [sleep, setSleep] = useState(7);
  const [meetings, setMeetings] = useState(2);
  const [stress, setStress] = useState(3);

  const [decisionScore, setDecisionScore] = useState<number | null>(null);
  const [meetingRisk, setMeetingRisk] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  
const averageScore =
  history.length > 0
    ? Math.round(
        history.reduce((sum, item) => sum + item.decision_score, 0) /
          history.length
      )
    : null;

const trend =
  history.length >= 3 &&
  history[0].decision_score <
    history[1].decision_score &&
  history[1].decision_score <
    history[2].decision_score
    ? "downward"
    : history.length >= 3 &&
      history[0].decision_score >
        history[1].decision_score &&
      history[1].decision_score >
        history[2].decision_score
    ? "upward"
    : null;

    useEffect(() => {
    fetch("/api/log")
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) {
          setHistory(data.logs);
        }
      });
  }, []);

  
  const calculate = async () => {
    // Sleep penalty (performance-focused)
    let sleepPenalty = 0;
    if (sleep >= 7) {
      sleepPenalty = 0;
    } else if (sleep >= 5) {
      sleepPenalty = (7 - sleep) * 10;
    } else {
      sleepPenalty = (7 - sleep) * 15;
    }

    // Stress penalty
    let stressPenalty = (stress - 1) * 12;

    // Meeting penalty
    let meetingPenalty = meetings * 5;

    let stability =
      100 - sleepPenalty - stressPenalty - meetingPenalty;

    stability = Math.max(0, Math.min(100, stability));

    // Meeting overload
    let overload =
      meetings * 8 - sleep * 3;

    overload = Math.max(0, Math.min(100, overload));

    setDecisionScore(stability);
    setMeetingRisk(overload);

    await fetch("/api/log", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    sleep,
    meetings,
    stress,
    decisionScore: stability,
    meetingRisk: overload,
  }),
});

  };

  const getDecisionLabel = (score: number) => {
    if (score > 75) return "High Stability – Strong day for important decisions.";
    if (score > 50) return "Moderate Stability – Be selective with key decisions.";
    return "Low Stability – Avoid high-impact decisions today.";
  };

  const getMeetingLabel = (score: number) => {
    if (score > 70) return "High Overload Risk – Cognitive fatigue likely.";
    if (score > 40) return "Moderate Load – Monitor energy levels.";
    return "Low Overload – Healthy cognitive bandwidth.";
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl bg-zinc-900 rounded-2xl shadow-lg p-10 space-y-8">

        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            MindMeter
          </h1>
          <p className="text-gray-400 mt-2">
            Decision Stability & Cognitive Load Index
          </p>
        </div>

        <div className="space-y-6">

          <div>
            <label className="text-sm text-gray-400">
              Sleep Hours: {sleep}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={sleep}
              onChange={(e) => setSleep(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Meeting Hours Today: {meetings}
            </label>
            <input
              type="range"
              min="0"
              max="12"
              value={meetings}
              onChange={(e) => setMeetings(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Stress Level (1–5): {stress}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={stress}
              onChange={(e) => setStress(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

        </div>

        <button
          onClick={calculate}
          className="w-full bg-white text-black py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Calculate MindMeter
        </button>

{decisionScore !== null && averageScore !== null && (
  <div className="text-sm text-gray-400 mt-3">
    {decisionScore > averageScore
      ? `You are performing ${decisionScore - averageScore}% above your recent baseline.`
      : decisionScore < averageScore
      ? `You are ${averageScore - decisionScore}% below your recent baseline.`
      : "You are exactly at your recent baseline."}

{trend === "downward" && (
  <div className="text-red-400 text-sm mt-2">
    ⚠ 3-day downward stability trend detected.
  </div>
)}

{trend === "upward" && (
  <div className="text-green-400 text-sm mt-2">
    ↑ Positive stability trend detected.
  </div>
)}

  </div>
)}



<div className="text-center text-xs text-gray-500 px-6 pb-8">
  MindMeter is a performance guidance tool and does not provide medical or psychological diagnosis. It is intended for informational purposes only.
</div>

{history.length > 0 && (
  <div className="mt-10 space-y-4">
    <h2 className="text-xl font-semibold text-center">
      Recent Entries
    </h2>

    {history.map((item, index) => (
      <div
        key={index}
        className="bg-zinc-800 rounded-xl p-4 text-sm text-gray-300"
      >
        <div>Sleep: {item.sleep} hrs</div>
        <div>Meetings: {item.meetings} hrs</div>
        <div>Stress: {item.stress}</div>
        <div>Decision Score: {item.decision_score}%</div>
      </div>
    ))}
  </div>
)}
      </div>
      
    </main>
  );
}