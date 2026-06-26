import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const CAT_COLOR = {
  'Identitet':       'bg-gray-100 text-gray-600',
  'CBRN':            'bg-red-100 text-red-700',
  'Fältmateriel':    'bg-amber-100 text-amber-700',
  'Verktyg':         'bg-stone-100 text-stone-700',
  'Dricka':          'bg-blue-100 text-blue-700',
  'Bärande system':  'bg-orange-100 text-orange-700',
  'Sovsystem':       'bg-indigo-100 text-indigo-700',
  'Fältuniform':     'bg-green-100 text-green-700',
  'Underkläder':     'bg-pink-100 text-pink-700',
  'Handskar':        'bg-yellow-100 text-yellow-700',
  'Skodon':          'bg-lime-100 text-lime-700',
  'Optik & hörsel':  'bg-cyan-100 text-cyan-700',
  'Huvudbonader':    'bg-violet-100 text-violet-700',
  'Ytterkläder':     'bg-teal-100 text-teal-700',
  'Knäskydd':        'bg-rose-100 text-rose-700',
  'Hygien':          'bg-emerald-100 text-emerald-700',
  'Skyddsutrustning':'bg-red-100 text-red-800',
  'Tjänstedräkt':    'bg-slate-100 text-slate-700',
  'Vapentillbehör':  'bg-zinc-100 text-zinc-700',
};

function CatBadge({ cat }) {
  const cls = CAT_COLOR[cat] || 'bg-gray-100 text-gray-500';
  return <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cls}`}>{cat}</span>;
}

export default function PrioImport() {
  const { user } = useAuth();
  const fileRef  = useRef();
  const [members,  setMembers]  = useState([]);
  const [userId,   setUserId]   = useState('');
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null); // { items, prio_name, count }
  const [result,   setResult]   = useState(null); // { created, skipped, user_name }
  const [parsing,  setParsing]  = useState(false);
  const [importing,setImporting]= useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    api.unitInventory().then(setMembers).catch(() => {});
  }, []);

  async function handleParse() {
    if (!file) return;
    setParsing(true); setError(''); setPreview(null); setResult(null);
    try {
      const data = await api.prioParse(file);
      if (data.error) throw new Error(data.error);
      setPreview(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setParsing(false);
    }
  }

  async function handleImport() {
    if (!file || !userId) return;
    setImporting(true); setError('');
    try {
      const data = await api.prioImport(userId, file);
      if (data.error) throw new Error(data.error);
      setResult(data);
      setPreview(null);
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      setError(e.message);
    } finally {
      setImporting(false);
    }
  }

  function reset() {
    setPreview(null); setResult(null); setError('');
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  const cats = preview
    ? [...new Set(preview.items.map(i => i.category))].sort()
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 text-sm text-blue-800">
        Importera utrustning direkt från en PRIO-export (xlsx). Välj en soldat och ladda upp
        exportfilen — systemet skapar utrustningsposter för valda individen.
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-5 space-y-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Soldat att importera för</label>
          <select value={userId} onChange={e => { setUserId(e.target.value); reset(); }}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="">Välj soldat…</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name} — {m.unit_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">PRIO-export (.xlsx)</label>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={e => { setFile(e.target.files[0] || null); reset(); }}
            className="block text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-military-navy file:text-white hover:file:bg-[#16294a] cursor-pointer"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleParse}
            disabled={!file || parsing}
            className="btn-secondary text-sm"
          >
            {parsing ? 'Läser…' : 'Förhandsgranska'}
          </button>
          {preview && (
            <button
              onClick={handleImport}
              disabled={!userId || importing}
              className="btn-primary text-sm"
            >
              {importing ? 'Importerar…' : `Importera ${preview.count} artiklar`}
            </button>
          )}
        </div>

        {!userId && preview && (
          <p className="text-xs text-amber-700">Välj en soldat för att fortsätta med importen.</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-sm text-green-800">
          <p className="font-semibold">Import klar för {result.user_name}</p>
          <p>{result.created} artiklar skapade · {result.skipped} hoppades över (redan registrerade)</p>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div>
          {preview.prio_name && (
            <p className="text-xs text-gray-500 mb-2">
              Namn i PRIO-filen: <strong>{preview.prio_name}</strong> · {preview.count} artiklar
            </p>
          )}
          {cats.map(cat => (
            <div key={cat} className="mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{cat}</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {preview.items.filter(i => i.category === cat).map((it, idx) => (
                    <li key={idx} className="px-4 py-2.5 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900">{it.name}</div>
                        <div className="text-xs font-mono text-gray-400">{it.article_number}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400">{it.quantity} {it.unit}</span>
                        <CatBadge cat={it.category} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
