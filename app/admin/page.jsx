"use client";

import { useEffect, useState, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [tokenMint, setTokenMint] = useState("");
  const [agentWallet, setAgentWallet] = useState("");
  const [settingsStatus, setSettingsStatus] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);

  const fetchPending = useCallback(async (key) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/pending`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) throw new Error("Unauthorized or server error");
      const data = await res.json();
      setPending(data);
      setAuthed(true);
    } catch (e) {
      setError(e.message);
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async (key) => {
    try {
      const res = await fetch(`${API}/admin/settings`, {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setTokenMint(data.tokenMint || "");
      setAgentWallet(data.agentWallet || "");
    } catch (_) {}
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    localStorage.setItem("flow402_admin_key", apiKey);
    fetchPending(apiKey);
    fetchSettings(apiKey);
  }

  useEffect(() => {
    const saved = localStorage.getItem("flow402_admin_key");
    if (saved) {
      setApiKey(saved);
      fetchPending(saved);
      fetchSettings(saved);
    }
  }, [fetchPending, fetchSettings]);

  async function handleAction(id, action) {
    try {
      const res = await fetch(`${API}/admin/${action}/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) throw new Error("Action failed");
      setPending((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleSaveSettings() {
    setSettingsLoading(true);
    setSettingsStatus(null);
    try {
      const res = await fetch(`${API}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ tokenMint, agentWallet }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSettingsStatus({ ok: false, msg: data.error || "Failed to save" });
      } else {
        setSettingsStatus({ ok: true, msg: "Saved" });
      }
    } catch (e) {
      setSettingsStatus({ ok: false, msg: e.message });
    } finally {
      setSettingsLoading(false);
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="glass p-8 rounded-xl space-y-4 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold">Admin</h1>
          <p className="text-sm text-gray-400">
            Enter the API key to access admin settings.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API key"
            required
            className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neutral-500 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full disabled:opacity-50"
          >
            {loading ? "Checking\u2026" : "Login"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Settings */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <div className="glass p-6 rounded-xl space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Token CA (mint address)</label>
              <input
                type="text"
                value={tokenMint}
                onChange={(e) => setTokenMint(e.target.value.trim())}
                placeholder="e.g. EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-neutral-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Agent Wallet (receives SOL for buyback)</label>
              <input
                type="text"
                value={agentWallet}
                onChange={(e) => setAgentWallet(e.target.value.trim())}
                placeholder="e.g. 8wudPsbmTZB6b8rRzGXXWpAw5gBAy4ASoqSGEJZvwdkk"
                className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-neutral-500 transition"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveSettings}
                disabled={settingsLoading}
                className="button-primary disabled:opacity-50"
              >
                {settingsLoading ? "Saving\u2026" : "Save"}
              </button>
              {settingsStatus && (
                <span className={`text-sm ${settingsStatus.ok ? "text-green-400" : "text-red-400"}`}>
                  {settingsStatus.msg}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">
              Leave Token CA empty to use native SOL. Agent wallet is where 50% of every payment goes for buyback.
            </p>
          </div>
        </div>

        {/* Pending Submissions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Pending Submissions</h2>
            <p className="text-sm text-gray-400 mt-1">
              {pending.length} item{pending.length !== 1 ? "s" : ""} waiting for
              review
            </p>
          </div>
          <button
            onClick={() => fetchPending(apiKey)}
            className="button-secondary text-sm"
          >
            Refresh
          </button>
        </div>

        {pending.length === 0 ? (
          <div className="glass p-8 rounded-xl text-center">
            <p className="text-gray-500">No pending submissions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((item) => (
              <div
                key={item.id}
                className="glass p-5 rounded-xl space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold truncate">
                        {item.title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 border border-neutral-700 px-1.5 py-0.5 rounded shrink-0">
                        {item.type}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-400">{item.description}</p>
                    )}
                    <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                      <p>By: {item.creatorName}</p>
                      <p className="break-all">Wallet: {item.creatorWallet}</p>
                      {item.submittedAt && (
                        <p>
                          Submitted:{" "}
                          {new Date(item.submittedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(item.id, "approve")}
                      className="text-sm px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "reject")}
                      className="text-sm px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {item.body && (
                  <div className="bg-black/60 border border-neutral-700 rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                      {item.body}
                    </pre>
                  </div>
                )}

                {item.entries && item.entries.length > 0 && (
                  <div className="bg-black/60 border border-neutral-700 rounded-lg p-3">
                    {item.entries.map((entry, i) => (
                      <p key={i} className="text-xs text-gray-300">
                        {entry.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
