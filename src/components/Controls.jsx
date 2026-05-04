const shapes = ['round', 'oval', 'emerald', 'cushion'];

export default function Controls({ settings, onChange, mmDisplay }) {
  return (
    <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900/70 p-4">
      <div><label className="text-xs text-zinc-400">Mode</label>
        <select className="w-full mt-1 bg-zinc-800 rounded p-2" value={settings.mode} onChange={(e)=>onChange({mode:e.target.value})}>
          <option value="quick">Quick Preview (approximate)</option>
          <option value="accurate">Accurate Mode</option>
        </select>
      </div>
      <div><label className="text-xs text-zinc-400">Shape</label><div className="grid grid-cols-4 gap-2 mt-1">{shapes.map((s)=><button key={s} onClick={()=>onChange({shape:s})} className={`rounded p-2 text-xs ${settings.shape===s?'bg-amber-200 text-zinc-900':'bg-zinc-800'}`}>{s}</button>)}</div></div>
      <div><label className="text-xs text-zinc-400">Carat: {settings.carat.toFixed(2)} ct</label><input type="range" min="0.25" max="10" step="0.01" value={settings.carat} onChange={(e)=>onChange({carat:Number(e.target.value)})} className="w-full"/></div>
      <p className="text-sm text-zinc-300">Stone size: {mmDisplay}</p>
      {settings.mode==='accurate' && <div className="grid grid-cols-2 gap-2"><input type="number" className="bg-zinc-800 p-2 rounded" placeholder="US ring size" value={settings.usSize ?? ''} onChange={(e)=>onChange({usSize:Number(e.target.value)})}/><input type="number" className="bg-zinc-800 p-2 rounded" placeholder="Ref width px" value={settings.referencePx ?? ''} onChange={(e)=>onChange({referencePx:Number(e.target.value)})}/></div>}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.debug} onChange={(e)=>onChange({debug:e.target.checked})}/> Debug landmarks</label>
    </div>
  );
}
