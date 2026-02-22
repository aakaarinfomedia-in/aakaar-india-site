"use client";

import { useState, useEffect } from "react";

export default function MindMeter() {
  const [sleep, setSleep] = useState(7);
  const [meetings, setMeetings] = useState(2);
  const [stress, setStress] = useState(3);

  const [decisionScore, setDecisionScore] = useState<number | null>(null);
  const [meetingRisk, setMeetingRisk] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [totalChecks, setTotalChecks] = useState<number>(0);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
const [emailError, setEmailError] = useState("");
  const fetchHistory = async () => {
    const res = await fetch("/api/log");
    const data = await res.json();
    if (data.logs) setHistory(data.logs);
    if (data.totalCount !== undefined)
      setTotalChecks(data.totalCount);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const averageScore =
    history.length > 0
      ? Math.round(
          history.reduce(
            (sum, item) => sum + item.decision_score,
            0
          ) / history.length
        )
      : null;

  const trend =
    history.length >= 3
      ? history[0].decision_score <
        history[1].decision_score &&
        history[1].decision_score <
          history[2].decision_score
        ? "downward"
        : history[0].decision_score >
          history[1].decision_score &&
          history[1].decision_score >
            history[2].decision_score
        ? "upward"
        : null
      : null;

  const calculate = async () => {
    let sleepPenalty = 0;
    if (sleep >= 7) sleepPenalty = 0;
    else if (sleep >= 5) sleepPenalty = (7 - sleep) * 10;
    else sleepPenalty = (7 - sleep) * 15;

    let stressPenalty = (stress - 1) * 12;
    let meetingPenalty = meetings * 5;

    let stability =
      100 - sleepPenalty - stressPenalty - meetingPenalty;

    stability = Math.max(0, Math.min(100, stability));

    let overload = meetings * 8 - sleep * 3;
    overload = Math.max(0, Math.min(100, overload));

    setDecisionScore(stability);
    setMeetingRisk(overload);

    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sleep,
        meetings,
        stress,
        decisionScore: stability,
        meetingRisk: overload,
      }),
    });

    await fetchHistory();
  };

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};  

const handleEarlyAccess = async () => {
if (!isValidEmail(email)) {
  setEmailError("Enter a valid email address.");
  return;
}

setEmailError("");

  await fetch("/api/early-access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  setSubmitted(true);
  setEmail("");
};

  const getDecisionAdvisory = (score: number) => {
    if (score > 75)
      return (
        <>
          <p>You are operating with strong clarity today.</p>
          <p>Suitable for important or strategic decisions.</p>
        </>
      );

    if (score > 50)
      return (
        <>
          <p>Your decision capacity is stable but not optimal.</p>
          <p>Prioritise structured or lower-risk decisions.</p>
        </>
      );

    return (
      <>
        <p>Your decision readiness appears reduced today.</p>
        <p>Consider postponing high-impact commitments if feasible.</p>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">

        {/* LEFT PANEL - TOOL */}
        <div className="flex-1 bg-zinc-900 rounded-2xl shadow-lg p-10 space-y-8">

          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight">
              MindMeter
            </h1>
            <p className="text-gray-400 mt-2">
              Understand your decision readiness based on sleep, load, and stress.
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
                Meeting Hours: {meetings}
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
            Evaluate Decision Readiness
          </button>

          {totalChecks > 0 && (
            <div className="text-center text-sm text-gray-400 mt-3">
              {totalChecks} evaluations recorded so far.
            </div>
          )}

          {decisionScore !== null && (
            <div className="space-y-4 text-center mt-6">

              <div className="text-5xl font-semibold">
                {decisionScore}%
              </div>

              <div className="text-gray-300 text-sm space-y-1">
                {getDecisionAdvisory(decisionScore)}
              </div>

              {averageScore !== null && (
                <div className="text-sm text-gray-400 mt-2">
                  Compared to recent baseline:{" "}
                  {decisionScore > averageScore
                    ? `${decisionScore - averageScore}% higher`
                    : decisionScore < averageScore
                    ? `${averageScore - decisionScore}% lower`
                    : "aligned"}
                </div>
              )}

              {trend === "downward" && (
                <div className="text-yellow-400 text-sm mt-2">
                  Recent entries suggest decreasing clarity.
                </div>
              )}

              {trend === "upward" && (
                <div className="text-green-400 text-sm mt-2">
                  Stability trajectory improving.
                </div>
              )}

              <div className="mt-6 text-lg font-semibold">
                Cognitive Load Indicator: {meetingRisk}%
              </div>

              <div className="text-sm text-gray-400">
                Reflects estimated mental bandwidth usage.
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Many professionals use this before important decisions.
              </div>

            </div>
          )}

          {history.length > 0 && (
            <div className="mt-10 space-y-4">
              <h2 className="text-xl font-semibold text-center">
                Recent Decision Logs
              </h2>

              {history.map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 rounded-xl p-4 text-sm text-gray-300"
                >
                  <div>Sleep: {item.sleep} hrs</div>
                  <div>Meetings: {item.meetings} hrs</div>
                  <div>Stress: {item.stress}</div>
                  <div>Decision Readiness: {item.decision_score}%</div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT PANEL - PRO */}
 <div className="w-full lg:w-96">
  <div className="bg-zinc-900 rounded-2xl shadow-lg p-6 space-y-4 sticky top-10">
    <h2 className="text-xl font-semibold">
      🔒 Decision Intelligence Pro
    </h2>

    <ul className="text-sm text-gray-300 space-y-2">
      <li>• 30-Day Stability Trend</li>
      <li>• Volatility Index</li>
      <li>• Weekly Executive Summary</li>
      <li>• Priority Decision Alerts</li>
    </ul>

    {!submitted ? (
      <div className="flex flex-col gap-3 mt-4">

        <input
          type="email"
          placeholder="Enter email for early access"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          className="px-3 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none"
        />

        {/* Inline Email Error */}
        {emailError && (
          <p className="text-red-400 text-sm">
            {emailError}
          </p>
        )}

        <button
          onClick={async () => {
            if (!isValidEmail(email)) {
              setEmailError("Please enter a valid email address.");
              return;
            }

            setEmailError("");

            await fetch("/api/early-access", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            });

            setSubmitted(true);
            setEmail("");
          }}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          Join Early Access
        </button>

      </div>
    ) : (
      <p className="text-green-400 text-sm mt-2">
        You’re on the early access list.
      </p>
    )}
  </div>
</div>

      </div>
    </main>
  );
}