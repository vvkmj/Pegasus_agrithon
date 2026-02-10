import React, { useState } from 'react';
import { Users, Package, Truck, Plus, Search, Filter, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { createBatch } from '../services/db';
import ProductionForm from '../components/ProductionForm';
import QRCodeCard from '../components/QRCodeCard';
import FarmerSelector from '../components/FarmerSelector';
import './SupplierDashboard.css';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card stat-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="icon-wrapper" style={{ color: color, background: `rgba(255,255,255,0.1)` }}>
      <Icon size={24} />
    </div>
    <div className="stat-info">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  </div>
);

const SupplierDashboard = ({ user, batches, setBatches, farmers }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  // Default to first farmer if available, otherwise null
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers.length > 0 ? farmers[0].id : null);

  // Effect to update selectedFarmerId when farmers are loaded
  React.useEffect(() => {
    if (!selectedFarmerId && farmers.length > 0) {
      setSelectedFarmerId(farmers[0].id);
    }
  }, [farmers, selectedFarmerId]);

  // Filter batches for the selected farmer context, handle case where no farmer is selected
  const displayedBatches = selectedFarmerId ? batches.filter(b => b.farmerId === selectedFarmerId) : [];

  const totalActiveFarmers = new Set(batches.map(b => b.farmerId)).size;
  const totalVolume = batches.length;

  const handleCreateBatch = async (formData) => {
    const selectedFarmer = farmers.find(f => f.id === selectedFarmerId);
    const newBatch = {
      id: `B-${formData.fruitType.toUpperCase()}-2024-${Math.floor(Math.random() * 1000)}`,
      farmerId: selectedFarmerId,
      ...formData,
      initialHealthScore: 100,
      currentLocation: user.location, // Supplier's location
      status: 'PACKED',
      description: `Collected from ${selectedFarmer?.name || 'Unknown'}. ${formData.variety} ${formData.fruitType}.`
    };

    // Persist to DB (or fallback)
    const savedBatch = await createBatch(newBatch);

    if (savedBatch) {
      setBatches([savedBatch, ...batches]);
      setShowForm(false);
      setSelectedBatch(savedBatch);
    }
  };

  return (
    <div className="supplier-dashboard">
      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard icon={Users} label="Farmers with Batches" value={totalActiveFarmers} color="var(--color-primary-green)" />
        <StatCard icon={Package} label="Total Batches Collected" value={totalVolume} color="var(--color-primary-blue)" />
        <StatCard icon={Truck} label="In Transit" value={batches.filter(b => b.status === 'IN_TRANSIT').length} color="var(--status-warning)" />
      </div>

      <div className="dashboard-content">
        {/* Main Action Area */}
        <div className="main-section">
          <div className="glass-card context-bar">
            <FarmerSelector farmers={farmers} selectedFarmerId={selectedFarmerId} onSelect={setSelectedFarmerId} />
            <div className="context-actions">
              <button className="add-btn" onClick={() => { setShowForm(true); setSelectedBatch(null); }}>
                <Plus size={18} /> New Collection
              </button>
            </div>
          </div>

          <div className="section-header">
            <h3>Collections for {farmers.find(f => f.id === selectedFarmerId)?.name || 'Unknown'}</h3>
          </div>

          <div className="batches-list">
            {displayedBatches.length > 0 ? displayedBatches.map(batch => (
              <div
                key={batch.id}
                className={`glass-card batch-item ${selectedBatch?.id === batch.id ? 'active' : ''}`}
                onClick={() => { setSelectedBatch(batch); setShowForm(false); }}
              >
                <div className="batch-icon">
                  <Package size={20} />
                </div>
                <div className="batch-info">
                  <span className="batch-name">{batch.fruitType} ({batch.variety})</span>
                  <span className="batch-date">{new Date(batch.harvestDate).toLocaleDateString()}</span>
                </div>
                <div className={`status-pill ${batch.status.toLowerCase()}`}>
                  {batch.status.replace('_', ' ')}
                </div>
              </div>
            )) : (
              <div className="no-data">No collections found for this farmer.</div>
            )}
          </div>
        </div>

        {/* Detail / Form Panel */}
        <div className="side-panel">
          {showForm ? (
            <div className="slide-in">
              <ProductionForm onSubmit={handleCreateBatch} />
            </div>
          ) : selectedBatch ? (
            <div className="slide-in">
              <QRCodeCard batch={selectedBatch} />
            </div>
          ) : (
            <div className="empty-state glass-card">
              <Package size={48} color="var(--color-text-muted)" />
              <p>Select a collection to view details or log a new one.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default SupplierDashboard;
