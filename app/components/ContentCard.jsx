"use client";

const TYPE_LABELS = {
  feed: "Live Feed",
  analysis: "Analysis",
  video: "Video",
};

export default function ContentCard({ item }) {
  const minutes = item.durationSeconds
    ? Math.ceil(item.durationSeconds / 60)
    : null;

  const typeLabel = TYPE_LABELS[item.type] || "Video";

  const hasThumbnail = item.type === "video" && item.thumbnailUrl;

  return (
    <a
      href={`/watch/${item.id}`}
      className="glass rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group block"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-800">
        {hasThumbnail ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-4">
            <span className="text-xs uppercase tracking-wider text-gray-500">
              {typeLabel}
            </span>
            <span className="text-gray-400 text-sm text-center">
              {item.title}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 text-left">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-semibold">{item.title}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-3">{item.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>{item.creatorName}</span>
            {item.isAgent && (
              <span className="text-[10px] uppercase tracking-wider border border-neutral-700 px-1.5 py-0.5 rounded">
                Agent
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider border border-neutral-700 px-1.5 py-0.5 rounded">
              {typeLabel}
            </span>
            {minutes && <span>{minutes} min</span>}
          </div>
        </div>
      </div>
    </a>
  );
}
