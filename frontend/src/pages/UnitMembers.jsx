import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  soldat:'Soldat', grpc:'Gruppchef', pc:'Plutonchef', toc:'Troppchef',
  kompc:'Kompanichef', kvm:'Kvartermästare', s4:'S4', batCh:'Bataljonschef', stab:'Stab'
};

const ASSIGNABLE = {
  grpc:  ['soldat'],
  pc:    ['soldat','grpc'],
  kompc: ['soldat','grpc','pc'],
  kvm:   ['soldat','grpc','pc'],
  s4:    ['soldat','grpc','pc','kompc','kvm'],
  batCh: ['soldat','grpc','pc','kompc','kvm','s4'],
  stab:  ['soldat','grpc','pc','kompc','kvm','s4'],
};

export default function UnitMembers() {
  const { user, hasRole } = useAuth();
  const [members, setMembers]   = useState([]);
  const [pnr, setPnr]           = useState('');
  const [role, setRole]         = useState('soldat');
  const [adding, setAdding]     = useState(false);
  const [error, setError]       = useState('');

  const unitId = user?.org_unit_id;
  const assignable = ASSIGNABLE[user?.role] || [];

  function load() {
    if (unitId) api.unitMembers(unitId).then(setMembers);
  }
  useEffect(load, [unitId]);

  async function addMember(e) {
    e.preventDefault();
    if (!pnr) return;
    setAdding(true); setError('');
    try {
      await api.addMember(unitId, { personal_number: pnr, role });
      setPnr(''); setRole('soldat');
      load();
    } catch(err) { setError(err.message); }
    finally { setAdding(false); }
  }

  async function remove(memberId) {
    if (!confirm('Ta bort ur enheten?')) return;
    await api.removeMember(unitId, memberId).catch(e => alert(e.message));
    load();
  }

  async function changeRole(memberId, newRole) {
    await api.setMemberRole(unitId, memberId, newRole).catch(e => alert(e.message));
    load();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-military-navy mb-6">Min enhet</h1>

      {/* Add member form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Lägg till person</h2>
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        <form onSubmit={addMember} className="flex gap-2 flex-wrap">
          <input
            placeholder="Personnummer (YYYYMMDDXXXX)"
            value={pnr} onChange={e => setPnr(e.target.value)}
            className="flex-1 min-w-48 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-military-steel"
          />
          {hasRole('pc') && (
            <select value={role} onChange={e => setRole(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none">
              {assignable.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          )}
          <button type="submit" disabled={adding} className="btn-primary">
            {adding ? 'Lägger till…' : 'Lägg till'}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">
          Om personen inte loggat in ännu matchas de när de loggar in med BankID.
        </p>
      </div>

      {/* Member list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">
            {members.length} {members.length === 1 ? 'person' : 'personer'}
          </span>
        </div>
        {members.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Inga medlemmar</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {members.map(m => (
              <li key={m.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {m.name}
                    {!m.profile_complete && (
                      <span className="ml-2 badge bg-yellow-100 text-yellow-700">Väntar inloggning</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{m.email} · {m.mobile}</div>
                  <div className="text-xs text-gray-400">{m.unit_name}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {hasRole('pc') && m.id !== user.id ? (
                    <select value={m.role} onChange={e => changeRole(m.id, e.target.value)}
                            className="border rounded px-2 py-1 text-xs focus:outline-none">
                      {assignable.map(r => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-gray-400">{ROLE_LABELS[m.role]}</span>
                  )}
                  {m.id !== user.id && (
                    <button onClick={() => remove(m.id)}
                            className="text-xs text-red-400 hover:text-red-600 transition-colors">
                      Ta bort
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
