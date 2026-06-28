import React from 'react';

export const RANKS = [
  { value: '',       label: '— Ingen grad —',  abbr: '',       insignia: '',       cls: '' },
  // Officerare
  { value: 'mj',    label: 'Major',            abbr: 'Mj',    insignia: '★★★★',  cls: 'text-yellow-500' },
  { value: 'kn',    label: 'Kapten',           abbr: 'Kn',    insignia: '★★★',   cls: 'text-yellow-500' },
  { value: 'lt',    label: 'Löjtnant',         abbr: 'Lt',    insignia: '★★',    cls: 'text-yellow-500' },
  { value: 'fk',    label: 'Fänrik',           abbr: 'Fk',    insignia: '★',     cls: 'text-yellow-500' },
  // Specialistofficerare
  { value: 'fv',    label: 'Förvaltare',       abbr: 'Fv',    insignia: '⬡⬡⬡⬡', cls: 'text-amber-500' },
  { value: 'fj',    label: 'Fanjunkare',       abbr: 'Fj',    insignia: '⬡⬡⬡',  cls: 'text-amber-500' },
  { value: 'oserg', label: 'Översergeant',     abbr: 'Öserg', insignia: '⬡⬡',   cls: 'text-amber-500' },
  { value: 'serg',  label: 'Sergeant',         abbr: 'Serg',  insignia: '⬡',     cls: 'text-amber-500' },
  // Gruppchefer
  { value: 'ofu',   label: 'Överfurir',        abbr: 'Öfu',   insignia: '››››',  cls: 'text-gray-400' },
  { value: 'fu',    label: 'Furir',            abbr: 'Fu',    insignia: '›››',   cls: 'text-gray-400' },
  { value: 'krp',   label: 'Korpral',          abbr: 'Krp',   insignia: '››',    cls: 'text-gray-400' },
  { value: 'vkrp',  label: 'Vicekorpral',      abbr: 'Vkrp',  insignia: '›',     cls: 'text-gray-400' },
  // Soldater
  { value: 'men4',  label: 'Menig 4',          abbr: 'Men 4', insignia: '',       cls: '' },
  { value: 'men3',  label: 'Menig 3',          abbr: 'Men 3', insignia: '',       cls: '' },
  { value: 'men2',  label: 'Menig 2',          abbr: 'Men 2', insignia: '',       cls: '' },
  { value: 'men1',  label: 'Menig 1',          abbr: 'Men 1', insignia: '',       cls: '' },
  { value: 'men',   label: 'Menig',            abbr: 'Men',   insignia: '',       cls: '' },
];

const RANK_MAP = Object.fromEntries(RANKS.map(r => [r.value, r]));

export function RankInsignia({ rank, className = '' }) {
  const r = RANK_MAP[rank];
  if (!r || !r.insignia) return null;
  return (
    <span className={`font-bold tracking-tighter leading-none ${r.cls} ${className}`} title={r.label}>
      {r.insignia}
    </span>
  );
}

export function RankAbbr({ rank, className = '' }) {
  const r = RANK_MAP[rank];
  if (!r || !r.abbr) return null;
  return (
    <span className={`text-xs text-gray-400 ${className}`}>{r.abbr}</span>
  );
}

export function RankSelect({ value, onChange, className = '' }) {
  const groups = [
    { label: 'Officerare',          values: ['mj','kn','lt','fk'] },
    { label: 'Specialistofficerare', values: ['fv','fj','oserg','serg'] },
    { label: 'Gruppchefer',          values: ['ofu','fu','krp','vkrp'] },
    { label: 'Soldater',             values: ['men4','men3','men2','men1','men'] },
  ];
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)} className={className}>
      <option value="">— Ingen grad —</option>
      {groups.map(g => (
        <optgroup key={g.label} label={g.label}>
          {g.values.map(v => {
            const r = RANK_MAP[v];
            return (
              <option key={v} value={v}>
                {r.abbr} — {r.label}
              </option>
            );
          })}
        </optgroup>
      ))}
    </select>
  );
}
