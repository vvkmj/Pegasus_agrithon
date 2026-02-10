import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { SUPPLIER, FARMERS, BATCHES } from './services/mockData';
import FarmerDashboard from './views/FarmerDashboard';
import ConsumerDashboard from './views/ConsumerDashboard';
import QualityControlView from './views/QualityControlView';
import FarmerTrackingView from './views/FarmerTrackingView';
import SettingsView from './views/SettingsView';
import SupplierDashboard from './views/SupplierDashboard';
import FarmerRegistryView from './views/FarmerRegistryView';
import LandingPage from './views/LandingPage';
import { getFarmers, getBatches } from './services/db';

// Content Views Routing
const ContentView = ({ activeTab, user, farmers, setFarmers, batches, setBatches }) => {
  switch (activeTab) {
    case 'dashboard':
    case 'collections':
      return <SupplierDashboard user={user} batches={batches} setBatches={setBatches} farmers={farmers} />;
    case 'registry':
      return <FarmerRegistryView farmers={farmers} setFarmers={setFarmers} />;
    case 'logistics':
      return <FarmerTrackingView user={user} batches={batches} />;
    case 'production':
      return <FarmerDashboard user={user} batches={batches} setBatches={setBatches} farmers={farmers} />;
    case 'health':
      return <QualityControlView user={user} batches={batches} />;
    case 'tracking':
      return <ConsumerDashboard batches={batches} />;
    case 'settings':
      return <SettingsView user={user} />;
    default:
      return (
        <div className="content-area">
          <h2 style={{ marginBottom: '20px' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View</h2>
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Work in Progress...
          </div>
        </div>
      );
  }
};

function App() {
  const [currentMode, setCurrentMode] = useState('LANDING'); // LANDING, SUPPLIER, CONSUMER
  const [activeTab, setActiveTab] = useState('dashboard');
  const [farmers, setFarmers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = SUPPLIER; // Logged in as Supplier

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedFarmers, fetchedBatches] = await Promise.all([
          getFarmers(),
          getBatches()
        ]);
        setFarmers(fetchedFarmers);
        setBatches(fetchedBatches);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: 'white' }}>Loading FreshTrace...</div>;
  }

  // Consumer Portal Layout
  if (currentMode === 'CONSUMER') {
    return (
      <div className="app-container consumer-mode">
        <header className="consumer-header">
          <button onClick={() => setCurrentMode('LANDING')} className="back-btn">← Home</button>
          <h3>FreshTrace Consumer</h3>
        </header>
        <main className="consumer-content">
          <ConsumerDashboard batches={batches} />
        </main>
      </div>
    );
  }

  // Supplier Portal Layout
  if (currentMode === 'SUPPLIER') {
    return (
      <div className="app-container">
        <div className="main-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="content-wrapper">
            <div className="supplier-header-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '32px' }}>
              <Header user={currentUser} />
              <button onClick={() => setCurrentMode('LANDING')} style={{ background: 'none', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Exit Portal</button>
            </div>
            <main className="main-content">
              <ContentView
                activeTab={activeTab}
                user={currentUser}
                farmers={farmers}
                setFarmers={setFarmers}
                batches={batches}
                setBatches={setBatches}
              />
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Default: Landing Page
  return <LandingPage onSelectMode={setCurrentMode} />;
}

export default App;
