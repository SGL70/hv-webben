import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

const TYPE_ORDER = ['bataljon','kompani','pluton','tropp','grupp'];
const TYPE_LABELS = {
  bataljon:'Bataljon', kompani:'Kompani', pluton:'Pluton', tropp:'Tropp', grupp:'Grupp'
};

function buildTree(units) {
  const map = {};
  units.forEach(u => { map[u.id] = { ...u, children: [] }; });
  const roots = [];
  units.forEach(u => {
    if (u.parent_id && map[u.parent_id]) map[u.parent_id].children.push(map[u.id]);
    else roots.push(map[u.id]);
  });
  return roots;
}

function TreeNode({ node, onDelete, depth = 0 }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ paddingLeft: depth * 20 }}>
      <div className="flex items-center gap-2 py-1.5 group">
        {node.children.length > 0 && (
          <button onClick={() => setOpen(o=>!o)} className="text-gray-400 w-4 text-xs">
            {open ? '▾' : '▸'}
          </button>
        )}
        {node.children.length === 0 && <span className="w-4" />}
        <span className="text-xs badge bg-gray-100 text-gray-500">{TYPE_LABELS[node.type]}</span>
        <span className="text-sm text-gray-900">{node.name}</span>
        <button onClick={() => onDelete(node.id)}
                className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
          Ta bort
        </button>
      </div>
      {open && node.children.map(c => (
        <TreeNode key={c.id} node={c} onDelete={onDelete} depth={depth+1} />
      ))}
    </div>
  );
}

export default function OrgAdmin() {
  const [units, setUnits]   = useState([]);
  const [form, setForm]     = useState({ name:'', type:'kompani', parent_id:'' });
  const [saving, setSaving] = useState(false);

  function load() { api.orgs().then(setUnits); }
  useEffect(load, []);

  async function create(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createUnit({ ...form, parent_id: form.parent_id || null });
      setForm(f => ({ ...f, name:'' }));
      load();
    } catch(err) { alert(err.message); }
    finally { setSaving(false); }
  }

  async function del(id) {
    if (!confirm('Ta bort enhet? Soldater kopplade till denna enhet förlorar sin tillhörighet.')) return;
    await api.deleteUnit(id).catch(e => alert(e.message));
    load();
  }

  const tree = buildTree(units);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-military-navy mb-6">Organisationsträd</h1>

      {/* Create form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Skapa ny enhet</h2>
        <form onSubmit={create} className="flex gap-2 flex-wrap">
          <input required placeholder="Namn" value={form.name}
                 onChange={e => setForm(f=>({...f,name:e.target.value}))}
                 className="flex-1 min-w-36 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-military-steel" />
          <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none">
            {TYPE_ORDER.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
          <select value={form.parent_id} onChange={e => setForm(f=>({...f,parent_id:e.target.value}))}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="">Ingen överordnad</option>
            {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.type})</option>)}
          </select>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Skapar…' : 'Skapa'}
          </button>
        </form>
      </div>

      {/* Tree view */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Nuvarande struktur</h2>
        {tree.length === 0 ? (
          <p className="text-sm text-gray-400">Inga enheter skapade</p>
        ) : (
          tree.map(n => <TreeNode key={n.id} node={n} onDelete={del} />)
        )}
      </div>
    </div>
  );
}
