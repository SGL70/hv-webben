import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]   = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  if (!user) return <div className="min-h-screen flex items-center justify-center">Laddar…</div>;

  async function handleSave(e) {
    e.preventDefault();
    if (!email || !mobile) { setError('E-post och mobilnummer krävs.'); return; }
    setSaving(true);
    try {
      await api.saveProfile({ email, mobile });
      await refreshUser();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-military-navy">Komplettera din profil</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ange kontaktuppgifter för att ta emot notifieringar om aktiviteter och ärenden.
          </p>
        </div>

        <div className="mb-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-military-navy font-medium">{user.name}</p>
          <p className="text-xs text-gray-400">Inloggad via BankID</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-postadress</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="namn@exempel.se"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-military-steel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobilnummer</label>
            <input
              type="tel" value={mobile} onChange={e => setMobile(e.target.value)}
              placeholder="070-000 00 00"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-military-steel"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full mt-2">
            {saving ? 'Sparar…' : 'Spara och fortsätt'}
          </button>
        </form>
      </div>
    </div>
  );
}
