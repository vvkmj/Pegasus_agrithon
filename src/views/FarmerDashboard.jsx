import React, { useState } from 'react';
import { Plus, Package, TrendingUp, Thermometer } from 'lucide-react';
import ProductionForm from '../components/ProductionForm';
import QRCodeCard from '../components/QRCodeCard';
import { BATCHES } from '../services/mockData';
import './FarmerDashboard.css';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card stat-card">
    <div className="icon-wrapper" style={{ background: `${color}20`, color: color }}>
      <Icon size={24} />
    </div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

import { createBatch } from '../services/db';

const FarmerDashboard = ({ user, batches, setBatches }) => {
  const [showForm, setShowForm] = useState(false);
  // Filter batches from props for this farmer
  const myBatches = batches.filter(b => b.farmerId === user.id);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleCreateBatch = async (formData) => {
    const newBatch = {
      id: `B-${formData.fruitType.toUpperCase()}-2024-${Math.floor(Math.random() * 1000)}`,
      farmerId: user.id,
      ...formData,
      initialHealthScore: 100,
      currentLocation: user.location,
      status: 'PACKED',
      description: `Fresh ${formData.variety} ${formData.fruitType}, harvested today.`
    };

    // Persist to DB
    const savedBatch = await createBatch(newBatch);
    if (savedBatch) {
      setBatches([savedBatch, ...batches]);
      setShowForm(false);
      setSelectedBatch(savedBatch);
    }
  };

  return (
    <div className="farmer-dashboard">
      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard icon={Package} label="Total Batches" value={myBatches.length} color="var(--color-primary-blue)" />
        <StatCard icon={TrendingUp} label="This Month" value="12" color="var(--color-primary-green)" />
        <StatCard icon={Thermometer} label="Avg Health" value="98%" color="var(--status-good)" />
      </div>

      <div className="dashboard-content">
        {/* Main Action Area */}
        <div className="main-section">
          <div className="section-header">
            <h3>Recent Production</h3>
            <button className="add-btn" onClick={() => { setShowForm(true); setSelectedBatch(null); }}>
              <Plus size={18} /> New Batch
            </button>
          </div>

          <div className="batches-list">
            {myBatches.map(batch => (
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
            ))}
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
              <p>Select a batch to view details or create a new one.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default FarmerDashboard;
