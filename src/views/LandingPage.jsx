import React from 'react';
import { Truck, Users, ArrowRight, Leaf } from 'lucide-react';
import InstallPrompt from '../components/InstallPrompt';

const LandingPage = ({ onSelectMode }) => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <header className="landing-header">
          <div className="logo">
            <Leaf size={32} className="logo-icon" />
            <h1>FreshTrace</h1>
          </div>
          <InstallPrompt />
          <p className="subtitle">Blockchain-Enabled Farm-to-Fork Tracking</p>
        </header>

        <div className="role-cards">
          {/* Supplier Card */}
          <div className="role-card supplier" onClick={() => onSelectMode('SUPPLIER')}>
            <div className="card-icon">
              <Users size={48} />
            </div>
            <div className="card-content">
              <h2>Supplier Portal</h2>
              <p>Manage farmers, log collections, and track logistics.</p>
              <button className="action-btn">Login as Aggregator <ArrowRight size={16} /></button>
            </div>
          </div>

          {/* Consumer Card */}
          <div className="role-card consumer" onClick={() => onSelectMode('CONSUMER')}>
            <div className="card-icon">
              <Truck size={48} />
            </div>
            <div className="card-content">
              <h2>Consumer Tracker</h2>
              <p>Scan your fruit to view its digital passport and origin.</p>
              <button className="action-btn">Track Shipment <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default LandingPage;
