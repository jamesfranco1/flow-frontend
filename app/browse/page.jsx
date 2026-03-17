"use client";

import { useEffect, useState } from "react";
import ContentCard from "../components/ContentCard";

const API = process.env.NEXT_PUBLIC_API_URL || "";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "feed", label: "Feeds" },
  { key: "analysis", label: "Analysis" },
  { key: "video", label: "Video" },
];

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch(`${API}/content`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <header>
          <h1 className="text-3xl font-bold mb-2">Browse</h1>
          <p className="text-gray-400">
            Select a stream below to start a pay-per-second session.
          </p>
        </header>

        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-sm px-4 py-1.5 rounded-lg border transition ${
                filter === f.key
                  ? "border-white text-white bg-white/5"
                  : "border-neutral-700 text-gray-400 hover:text-white hover:border-neutral-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="glass animate-pulse aspect-[4/3] rounded-xl"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-24">
            No content available yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
