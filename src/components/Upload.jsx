export default function Upload({ onFile, error }) {
  const handle = (file) => file && onFile(file);
  return (
    <div className="rounded-2xl border border-zinc-700 p-4 bg-zinc-900/70">
      <p className="text-sm text-zinc-300 mb-2">Place your hand flat, palm down, fingers slightly apart.</p>
      <input className="w-full text-sm" type="file" accept="image/*" onChange={(e) => handle(e.target.files?.[0])} />
      {error && <p className="mt-2 text-rose-300 text-sm">{error}</p>}
    </div>
  );
}
