import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

function fmt(iso) {
  return new Date(iso).toLocaleDateString('sv-SE', {
    weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'
  });
}

const TYPE_COLORS = {
  övning:'bg-red-100 text-red-700',
  utbildning:'bg-blue-100 text-blue-700',
  möte:'bg-green-100 text-green-700',
  övrigt:'bg-gray-100 text-gray-600',
};
const RESP_COLORS = {
  ja:'bg-green-100 text-green-800 border-green-200',
  nej:'bg-red-100 text-red-800 border-red-200',
  kanske:'bg-yellow-100 text-yellow-800 border-yellow-200',
};

function ResponseButtons({ current, onSelect, disabled }) {
  return (
    <div className="flex gap-2 mt-3">
      {['ja','nej','kanske'].map(s => (
        <button key={s}
          onClick={() => onSelect(s)}
          disabled={disabled}
          className={`px-3 py-1 rounded text-xs font-medium border transition-colors
                      ${current === s ? RESP_COLORS[s] : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
        >
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </button>
      ))}
    </div>
  );
}

function CreateModal({ onClose, onCreated }) {
  const { user } = useAuth();
  const [orgs, setOrgs]   = useState([]);
  const [form, setForm]   = useState({
    title:'', description:'', type:'övning',
    start_time:'', end_time:'', org_unit_id: user?.org_unit_id || ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.orgs().then(setOrgs); }, []);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createActivity(form);
      onCreated();
    } catch(err) { alert(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-military-navy">Skapa aktivitet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={submit} className="px-6 py-4 space-y-3">
          <input required placeholder="Titel" value={form.title}
                 onChange={e => setForm(f=>({...f,title:e.target.value}))}
                 className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-military-steel" />
          <textarea placeholder="Beskrivning (valfritt)" value={form.description}
                    onChange={e => setForm(f=>({...f,description:e.target.value}))} rows={2}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-military-steel" />
          <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="övning">Övning</option>
            <option value="utbildning">Utbildning</option>
            <option value="möte">Möte</option>
            <option value="övrigt">Övrigt</option>
          </select>
          <select value={form.org_unit_id}
                  onChange={e => setForm(f=>({...f,org_unit_id:e.target.value}))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
            {orgs.map(o => <option key={o.id} value={o.id}>{o.name} ({o.type})</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Start</label>
              <input type="datetime-local" required value={form.start_time}
                     onChange={e => setForm(f=>({...f,start_time:e.target.value}))}
                     className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Slut</label>
              <input type="datetime-local" required value={form.end_time}
                     onChange={e => setForm(f=>({...f,end_time:e.target.value}))}
                     className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Avbryt</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Skapar…' : 'Skapa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Calendar() {
  const { hasRole } = useAuth();
  const [activities, setActivities] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [responding, setResponding] = useState(null);

  function load() { api.activities().then(setActivities); }
  useEffect(load, []);

  async function respond(actId, status) {
    setResponding(actId);
    await api.respond(actId, status).catch(()=>{});
    load();
    setResponding(null);
  }

  const past     = activities.filter(a => new Date(a.end_time) < new Date());
  const upcoming = activities.filter(a => new Date(a.end_time) >= new Date());

  function ActivityCard({ a }) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="font-medium text-gray-900 text-sm">{a.title}</span>
          <span className={`badge shrink-0 ${TYPE_COLORS[a.type] || TYPE_COLORS.övrigt}`}>
            {a.type}
          </span>
        </div>
        <div className="text-xs text-gray-400 mb-0.5">{fmt(a.start_time)} – {fmt(a.end_time)}</div>
        <div className="text-xs text-gray-400">{a.unit_name} · {a.created_by_name}</div>
        {a.description && <p className="text-xs text-gray-500 mt-2">{a.description}</p>}
        <ResponseButtons current={a.my_response} disabled={responding === a.id}
                         onSelect={s => respond(a.id, s)} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-military-navy">Kalender</h1>
        {hasRole('pc') && (
          <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">
            + Ny aktivitet
          </button>
        )}
      </div>

      {upcoming.length === 0 && past.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">Inga aktiviteter</div>
      )}

      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Kommande
          </h2>
          <div className="space-y-3">
            {upcoming.map(a => <ActivityCard key={a.id} a={a} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Genomförda
          </h2>
          <div className="space-y-3 opacity-60">
            {past.map(a => <ActivityCard key={a.id} a={a} />)}
          </div>
        </section>
      )}

      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />
      )}
    </div>
  );
}
