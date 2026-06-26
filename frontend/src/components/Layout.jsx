import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  soldat:'Soldat', grpc:'Gruppchef', pc:'Plutonchef', toc:'Troppchef',
  kompc:'Kompanichef', kvm:'Komp-VKM', s4:'S4 / Bat-VKM', batCh:'Bataljonschef', stab:'Stab'
};

function NavItem({ to, label, icon }) {
  return (
    <NavLink to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors
         ${isActive
           ? 'bg-white/15 text-white font-medium'
           : 'text-white/70 hover:text-white hover:bg-white/10'}`
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function Layout({ children }) {
  const { user, logout, hasRole, isLogistics } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar — fixed height, sticks to top */}
      <aside className="w-56 bg-military-navy flex flex-col shrink-0 h-screen sticky top-0">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="" className="h-9 w-auto shrink-0" />
          <div>
            <div className="text-white font-bold text-sm tracking-wide leading-tight">BATALJONSSYSTEM</div>
            <div className="text-white/50 text-xs">Prototyp v0.1</div>
          </div>
        </div>

        {/* User + logout — directly under logo */}
        <div className="px-4 py-3 border-b border-white/10 shrink-0">
          <div className="text-white text-sm font-medium truncate">{user?.name}</div>
          <div className="text-white/50 text-xs">{ROLE_LABELS[user?.role]}</div>
          <div className="text-white/30 text-xs truncate">{user?.unit_name}</div>
          <button onClick={handleLogout}
                  className="mt-2 text-xs text-white/50 hover:text-white transition-colors">
            Logga ut
          </button>
        </div>

        {/* Nav — scrollable if needed */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
          <NavItem to="/"           label="Översikt"         icon="🏠" />
          <NavItem to="/kalender"   label="Kalender"         icon="📅" />
          <NavItem to="/arenden"    label="Ärenden"          icon="📋" />
          <NavItem to="/utrustning" label="Pers. Utrustning" icon="🎒" />
          {hasRole('grpc') && (
            <NavItem to="/enhet"    label="Min enhet"        icon="👥" />
          )}
          {hasRole('s4') && (
            <NavItem to="/org"      label="Org-träd"         icon="🏗️" />
          )}
        </nav>
      </aside>

      {/* Content — scrolls independently */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
