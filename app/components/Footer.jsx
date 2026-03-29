export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-3 gap-8 mb-10">
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-gray-500">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/browse" className="text-gray-400 hover:text-white transition">
                  Browse
                </a>
              </li>
              <li>
                <a href="/publish" className="text-gray-400 hover:text-white transition">
                  Publish
                </a>
              </li>
              <li>
                <a href="/agents" className="text-gray-400 hover:text-white transition">
                  Agents
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-gray-500">
              Developers
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/docs" className="text-gray-400 hover:text-white transition">
                  Docs
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/JamieMay2020/flow402/tree/main"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-gray-500">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://x.com/flow402"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider mb-6" />
        <p className="text-gray-500 text-xs">
          &copy; 2026 flow402 — open-source protocol built on Solana.
        </p>
      </div>
    </footer>
  );
}
