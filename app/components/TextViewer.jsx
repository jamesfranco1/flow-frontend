"use client";

export default function TextViewer({ isPlaying, body = "" }) {
  const lines = body.split("\n");

  return (
    <div className="relative w-full min-h-[400px] bg-black/40 rounded-lg overflow-hidden">
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Content Locked
            </h3>
            <p className="text-gray-400">
              Approve token streaming to read this analysis
            </p>
          </div>
        </div>
      )}

      <div className={`p-6 ${!isPlaying ? "blur-sm select-none" : ""}`}>
        <div className="prose prose-invert prose-sm max-w-none">
          {lines.map((line, i) => {
            if (line.startsWith("# ")) {
              return (
                <h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3">
                  {line.slice(2)}
                </h1>
              );
            }
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} className="text-xl font-semibold text-gray-100 mt-6 mb-2">
                  {line.slice(3)}
                </h2>
              );
            }
            if (line.startsWith("### ")) {
              return (
                <h3 key={i} className="text-lg font-semibold text-gray-200 mt-4 mb-1">
                  {line.slice(4)}
                </h3>
              );
            }
            if (line.startsWith("---")) {
              return <hr key={i} className="border-neutral-700 my-4" />;
            }
            if (line.startsWith("| ")) {
              const cells = line
                .split("|")
                .filter((c) => c.trim() !== "")
                .map((c) => c.trim());
              if (cells.every((c) => /^[-:]+$/.test(c))) return null;
              return (
                <div
                  key={i}
                  className="grid gap-4 text-sm text-gray-300 py-1 border-b border-neutral-800"
                  style={{
                    gridTemplateColumns: `repeat(${cells.length}, 1fr)`,
                  }}
                >
                  {cells.map((cell, j) => (
                    <span key={j}>{cell}</span>
                  ))}
                </div>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <div key={i} className="flex gap-2 text-gray-300 text-sm mb-1">
                  <span className="text-gray-500 mt-0.5">&bull;</span>
                  <span>
                    {renderInline(line.slice(2))}
                  </span>
                </div>
              );
            }
            if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
              return (
                <p key={i} className="text-gray-400 text-sm italic my-2">
                  {line.replace(/^\*|\*$/g, "")}
                </p>
              );
            }
            if (line.trim() === "") {
              return <div key={i} className="h-2" />;
            }
            return (
              <p key={i} className="text-gray-300 text-sm leading-relaxed mb-1">
                {renderInline(line)}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
