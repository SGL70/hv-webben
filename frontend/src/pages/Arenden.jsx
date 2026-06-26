import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUS_META = {
  ok:            { label:'Ok',            color:'bg-green-100 text-green-800'  },
  ej_mottagen:   { label:'Ej mottagen',   color:'bg-yellow-100 text-yellow-800'},
  ej_tilldelad:  { label:'Ej tilldelad',  color:'bg-gray-100 text-gray-500'   },
  förlustanmäld: { label:'Förlustanmäld', color:'bg-red-100 text-red-800'     },
  byte_pågår:    { label:'Byte pågår',    color:'bg-blue-100 text-blue-800'   },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.ok;
  return <span className={`badge ${m.color}`}>{m.label}</span>;
}

function fmt(iso) {
  return new Date(iso).toLocaleDateString('sv-SE');
}

export default function Arenden() {
  const { user, isLogistics } = useAuth();
  const navigate = useNavigate();
  const [unitInv,     setUnitInv]     = useState([]);
  const [cases,       setCases]       = useState([]);
  const [myReports,   setMyReports]   = useState([]);   // own km-ers
  const [teamReports, setTeamReports] = useState([]);   // to approve (logistics)
  const [startingInv, setStartingInv] = useState(false);

  function load() {
    api.reports().then(all => {
      setMyReports(all.filter(r => r.user_id === user?.id || !isLogistics()));
      if (isLogistics()) setTeamReports(all.filter(r => r.status === 'submitted' && r.user_id !== user?.id));
    }).catch(() => {});
    if (isLogistics()) {
      api.unitInventory().then(setUnitInv).catch(() => {});
      api.pendingCases().then(setCases).catch(() => {});
    }
  }

  useEffect(load, []);

  async function handleStartInventory() {
    if (!confirm('Starta inventering för hela kompaniet?\n\nAlla soldaters utrustning sätts till OK och de ombeds fylla i faktiskt antal.')) return;
    setStartingInv(true);
    try {
      const r = await api.startInventory();
      alert(`Inventering startad — ${r.started} soldater har fått inventeringsorder.`);
      load();
    } catch (e) { alert(e.message); }
    finally { setStartingInv(false); }
  }

  async function decide(caseId, action) {
    await api.decideCase(caseId, { action }).catch(e => alert(e.message));
    load();
  }

  const invOpen      = unitInv.filter(m => m.inv_status === 'open');
  const invSubmitted = unitInv.filter(m => m.inv_status === 'submitted');
  const invNone      = unitInv.filter(m => !m.inv_status);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-xl font-bold text-military-navy">Ärenden</h1>

      {/* ─── KM-ERS / UTLÄGG (alla användare) ────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Km-ers / Utlägg</h2>
          <button onClick={() => navigate('/rapporter')}
                  className="btn-primary text-xs">
            Ny rapport
          </button>
        </div>

        {myReports.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-8 text-center text-sm text-gray-400">
            Inga rapporter — klicka "Ny rapport" för att skapa.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {myReports.slice(0, 5).map(r => (
                <li key={r.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-sm text-gray-900">{r.report_date}</span>
                    {r.km > 0      && <span className="text-xs text-gray-500 ml-2">{r.km} km</span>}
                    {r.expenses > 0 && <span className="text-xs text-gray-500 ml-2">{Number(r.expenses).toFixed(0)} kr</span>}
                  </div>
                  <span className={`badge ${
                    r.status === 'approved' ? 'bg-green-100 text-green-800' :
                    r.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    r.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {r.status === 'approved' ? 'Godkänd' :
                     r.status === 'submitted' ? 'Inskickad' :
                     r.status === 'rejected'  ? 'Avvisad' : 'Utkast'}
                  </span>
                </li>
              ))}
            </ul>
            {myReports.length > 5 && (
              <div className="px-5 py-2.5 border-t border-gray-100">
                <button onClick={() => navigate('/rapporter')}
                        className="text-xs text-military-steel hover:underline">
                  Visa alla {myReports.length} rapporter →
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─── INVENTERING (logistik) ───────────────────────────── */}
      {isLogistics() && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Inventering</h2>
            <button onClick={handleStartInventory} disabled={startingInv} className="btn-primary text-xs">
              {startingInv ? 'Startar…' : unitInv.length > 0 ? 'Starta om inventering' : 'Starta inventering'}
            </button>
          </div>

          {unitInv.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-8 text-center text-sm text-gray-400">
              Ingen aktiv inventering. Klicka "Starta inventering" för att börja.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex gap-5 text-xs">
                <span className="text-green-700 font-medium">{invSubmitted.length} bekräftade</span>
                {invOpen.length > 0 && <span className="text-blue-600 font-medium">{invOpen.length} pågår</span>}
                {invNone.length > 0 && <span className="text-gray-400">{invNone.length} ej startad</span>}
                <span className="text-gray-300">/ {unitInv.length} totalt</span>
              </div>
              <ul className="divide-y divide-gray-100">
                {unitInv.map(m => (
                  <li key={m.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-sm text-gray-900">{m.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{m.unit_name}</span>
                    </div>
                    {m.inv_status === 'submitted' ? (
                      <span className="text-xs text-green-700 font-medium">✓ Bekräftad {m.submitted_at ? fmt(m.submitted_at) : ''}</span>
                    ) : m.inv_status === 'open' ? (
                      <span className="text-xs text-blue-500">Pågår sedan {fmt(m.inv_created)}</span>
                    ) : (
                      <span className="text-xs text-gray-300">Ej inventerad</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* ─── UTRUSTNINGSÄRENDEN (logistik) ────────────────────── */}
      {isLogistics() && (
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Utrustningsärenden</h2>

          {cases.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-8 text-center text-sm text-gray-400">
              Inga väntande utrustningsärenden
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {cases.map(c => (
                  <li key={c.id} className="px-5 py-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900">{c.equipment_name}</span>
                        <span className={`badge ${c.type === 'förlust' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                          {c.type === 'förlust' ? 'Förlust' : 'Byte'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {c.user_name} · {c.unit_name} · {fmt(c.created_at)}
                      </div>
                      {c.description && <div className="text-xs text-gray-500 mt-1 truncate">{c.description}</div>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {c.type === 'förlust' && (
                        <Link to={`/blankett/${c.id}`} className="text-xs text-military-steel hover:underline">Blankett</Link>
                      )}
                      <button onClick={() => decide(c.id, 'approve')}
                              className="text-xs px-2.5 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">
                        Godkänn
                      </button>
                      <button onClick={() => decide(c.id, 'reject')}
                              className="text-xs px-2.5 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors">
                        Avslå
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* ─── KM-ERS ATT GRANSKA (logistik) ────────────────────── */}
      {isLogistics() && teamReports.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Km-ers / Utlägg att granska</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {teamReports.map(r => (
                <li key={r.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-900">
                      {r.report_date}
                      {r.km > 0      && <span className="text-gray-500 ml-2">{r.km} km</span>}
                      {r.expenses > 0 && <span className="text-gray-500 ml-2">{Number(r.expenses).toFixed(0)} kr</span>}
                    </div>
                    <div className="text-xs text-gray-400">{r.user_name}</div>
                  </div>
                  <Link to="/rapporter"
                        className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Granska
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
