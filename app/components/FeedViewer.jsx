"use client";

export default function FeedViewer({ isPlaying, entries = [] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  function formatTime(ts) {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  }

  return (
    <div className="relative w-full min-h-[400px] bg-black/40 rounded-lg overflow-hidden">
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Live Feed Locked
            </h3>
            <p className="text-gray-400">
              Approve token streaming to view live signals
            </p>
          </div>
        </div>
      )}

      <div className={`p-5 space-y-4 ${!isPlaying ? "blur-sm select-none" : ""}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Live Feed
          </span>
        </div>

        {sorted.length === 0 ? (
          <p className="text-gray-500 text-sm">No entries yet.</p>
        ) : (
          sorted.map((entry, i) => (
            <div
              key={i}
              className="border-l-2 border-neutral-700 pl-4 py-2"
            >
              <p className="text-sm text-gray-200 leading-relaxed">
                {entry.text}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(entry.timestamp)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
