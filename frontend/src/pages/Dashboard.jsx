import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

const ROLE_LABELS = {
  soldat:'Soldat', grpc:'Gruppchef', pc:'Plutonchef', toc:'Troppchef',
  kompc:'Kompanichef', kvm:'Kvartermästare', s4:'S4', batCh:'Bataljonschef', stab:'Stab'
};

const RESPONSE_COLORS = {
  ja:     'bg-green-100 text-green-800 border-green-200',
  nej:    'bg-red-100 text-red-800 border-red-200',
  kanske: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

const STATUS_META = {
  ok:            { label:'Ok',            color:'text-green-600' },
  ej_mottagen:   { label:'Ej mottagen',   color:'text-yellow-600' },
  ej_tilldelad:  { label:'Ej tilldelad',  color:'text-gray-500' },
  förlustanmäld: { label:'Förlustanmäld', color:'text-red-600' },
  byte_pågår:    { label:'Byte pågår',    color:'text-blue-600' },
};

function fmt(iso) {
  return new Date(iso).toLocaleDateString('sv-SE', {
    weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'
  });
}

function InviteCard({ activity }) {
  const isPast = new Date(activity.start_time) < new Date();
  const resp = activity.my_response;
  const colorClass = resp ? RESPONSE_COLORS[resp] : 'bg-gray-50 border-gray-200';
  return (
    <Link to="/kalender"
          className={`block rounded-xl border p-3 hover:shadow-sm transition-shadow ${colorClass}`}>
      <div className="text-xs font-semibold text-gray-700 truncate">{activity.title}</div>
      <div className="text-xs text-gray-500 mt-0.5">{fmt(activity.start_time)}</div>
      <div className="text-xs text-gray-400">{activity.unit_name}</div>
      {!resp && !isPast && (
        <div className="mt-1.5 text-xs font-medium text-yellow-700">Svara →</div>
      )}
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [equipment, setEquipment]   = useState([]);
  const [reports, setReports]       = useState([]);
  const [openInv, setOpenInv]       = useState(null);

  useEffect(() => {
    api.activities().then(setActivities).catch(() => {});
    api.myEquipment().then(setEquipment).catch(() => {});
    api.reports().then(setReports).catch(() => {});
    api.myInventory().then(setOpenInv).catch(() => {});
  }, []);

  const upcoming = activities
    .filter(a => new Date(a.start_time) > new Date())
    .slice(0, 4);

  const issues = equipment.filter(e => e.status !== 'ok');

  const pendingReports = reports.filter(r => r.status === 'draft' || r.status === 'submitted');

  return (
    <div className="p-6 h-full">
      {/* Greeting */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-military-navy">
          God dag, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {ROLE_LABELS[user?.role]} · {user?.unit_name}
        </p>
      </div>

      {/* Inventeringsorder */}
      {openInv && (
        <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-amber-900">Inventering pågår</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Startad av {openInv.initiated_by_name} · {new Date(openInv.created_at).toLocaleDateString('sv-SE')}
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Gå till Pers. Utrustning och fyll i faktiskt antal för varje artikel.
            </p>
          </div>
          <button onClick={() => navigate('/utrustning')}
                  className="shrink-0 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">
            Fyll i inventering →
          </button>
        </div>
      )}

      {/* Main grid: center content + right sidebar */}
      <div className="flex gap-5">

        {/* Center column */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Hero image */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <img src="/hero.jpg" alt="Verksamhetsbild"
                 className="w-full object-cover"
                 style={{ maxHeight: '280px' }} />
          </div>

          {/* Invitation cards 2×2 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Kommande aktiviteter
              </h2>
              <Link to="/kalender" className="text-xs text-military-steel hover:underline">
                Visa alla
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-400">
                Inga kommande aktiviteter
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {upcoming.map(a => <InviteCard key={a.id} activity={a} />)}
              </div>
            )}
          </div>
        </div>

        {/* Right widget column */}
        <div className="w-52 shrink-0 flex flex-col gap-4">

          {/* Pers. Utrustning */}
          <Link to="/utrustning"
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow block">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Pers. Utrustning
            </h3>
            {issues.length === 0 ? (
              <p className="text-xs text-green-600">Allt ok</p>
            ) : (
              <ul className="space-y-1">
                {issues.slice(0, 4).map(e => (
                  <li key={e.id} className="flex items-center justify-between gap-1">
                    <span className="text-xs text-gray-700 truncate">{e.name}</span>
                    <span className={`text-xs shrink-0 ${STATUS_META[e.status]?.color}`}>
                      {STATUS_META[e.status]?.label}
                    </span>
                  </li>
                ))}
                {issues.length > 4 && (
                  <li className="text-xs text-gray-400">+{issues.length - 4} till</li>
                )}
              </ul>
            )}
          </Link>

          {/* Kmers/utlägg */}
          <Link to="/rapporter"
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow block">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Kmers / Utlägg
            </h3>
            {pendingReports.length === 0 ? (
              <p className="text-xs text-gray-400">Inga väntande rapporter</p>
            ) : (
              <ul className="space-y-1">
                {pendingReports.slice(0, 3).map(r => (
                  <li key={r.id} className="text-xs text-gray-700">
                    {r.report_date}
                    {r.km > 0 && <span className="text-gray-400"> · {r.km} km</span>}
                    {r.expenses > 0 && <span className="text-gray-400"> · {Number(r.expenses).toFixed(0)} kr</span>}
                  </li>
                ))}
              </ul>
            )}
          </Link>

          {/* Kalender (tall) */}
          <Link to="/kalender"
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow block flex-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Kalender
            </h3>
            {activities.length === 0 ? (
              <p className="text-xs text-gray-400">Inga aktiviteter</p>
            ) : (
              <ul className="space-y-2.5">
                {activities.slice(0, 8).map(a => (
                  <li key={a.id} className="border-l-2 border-military-steel pl-2">
                    <div className="text-xs font-medium text-gray-800 leading-tight">{a.title}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(a.start_time).toLocaleDateString('sv-SE', { day:'numeric', month:'short' })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Link>

        </div>
      </div>
    </div>
  );
}
