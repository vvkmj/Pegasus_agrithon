import React from 'react';
import { LayoutDashboard, Package, Truck, Activity, Settings, LogOut, Users } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Aggregator', icon: LayoutDashboard },
    { id: 'registry', label: 'Farmer Registry', icon: Users },
    { id: 'collections', label: 'Collections', icon: Package },
    { id: 'logistics', label: 'Live Logistics', icon: Truck },
  ];

  return (
    <aside className="sidebar glass-card">
      <div className="logo-container">
        <div className="logo-icon">
          <Package color="var(--color-primary-green)" size={28} />
        </div>
        <h2>Farm<span style={{ color: 'var(--color-primary-green)' }}>Trace</span></h2>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {activeTab === item.id && <div className="active-indicator" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="nav-item logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
