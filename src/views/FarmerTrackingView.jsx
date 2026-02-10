import React from 'react';
import { Truck, MapPin, Clock, Calendar } from 'lucide-react';
import { BATCHES } from '../services/mockData';
import LiveMap from '../components/LiveMap';
import './FarmerTrackingView.css';

const FarmerTrackingView = ({ user }) => {
  const activeShipments = BATCHES.filter(b =>
    b.farmerId === user.id && (b.status === 'IN_TRANSIT' || b.status === 'DELIVERED')
  );

  return (
    <div className="tracking-view">
      <div className="view-header">
        <h2>Live Logistics</h2>
        <p>Track your active shipments in real-time.</p>
      </div>

      <div className="shipments-grid">
        {activeShipments.length > 0 ? (
          activeShipments.map(batch => (
            <div key={batch.id} className="glass-card shipment-card">
              <div className="card-top">
                <span className="batch-id">{batch.id}</span>
                <span className={`status-badge ${batch.status.toLowerCase()}`}>
                  {batch.status.replace('_', ' ')}
                </span>
              </div>

              <div className="route-info">
                <div className="point">
                  <div className="dot start"></div>
                  <div className="text">
                    <span className="label">Origin</span>
                    <span className="val">{user.location}</span>
                  </div>
                </div>
                <div className="line"></div>
                <div className="point">
                  <div className="dot end">
                    {batch.status === 'IN_TRANSIT' && <div className="pulse"></div>}
                  </div>
                  <div className="text">
                    <span className="label">Current Location</span>
                    <span className="val">{batch.currentLocation}</span>
                  </div>
                </div>
              </div>

              <div className="meta-info">
                <div className="meta-item">
                  <Truck size={14} />
                  <span>KA-01-TX-9988</span>
                </div>
                <div className="meta-item">
                  <Clock size={14} />
                  <span>ETA: 4 Hours</span>
                </div>
              </div>

              <div className="map-placeholder" style={{ padding: 0, display: 'block' }}>
                {batch.currentLocationCoordinates ? (
                  <LiveMap
                    center={batch.currentLocationCoordinates}
                    zoom={10}
                    markers={[{ ...batch.currentLocationCoordinates, label: 'Current Location' }]}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px' }}>
                    <MapPin size={24} color="var(--color-primary-blue)" />
                    <span>Location data unavailable</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card empty-state">
            <Truck size={48} color="var(--color-text-muted)" />
            <p>No active shipments found.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default FarmerTrackingView;
