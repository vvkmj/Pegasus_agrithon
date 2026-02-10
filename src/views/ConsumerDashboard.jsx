import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Activity, CheckCircle, Clock, Leaf, Droplets, Scan, X } from 'lucide-react';
import { FARMERS } from '../services/mockData'; // Fallback or use passed props if available
import LiveMap from '../components/LiveMap';
import QRScanner from '../components/QRScanner';
import FreshnessGraph from '../components/FreshnessGraph';
import { calculateFreshness } from '../services/freshnessUtils';
import './ConsumerDashboard.css';

const HealthMeter = ({ score }) => {
  const getColor = (s) => {
    if (s > 80) return 'var(--status-good)';
    if (s > 50) return 'var(--status-warning)';
    return 'var(--status-critical)';
  };

  const color = getColor(score);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="health-meter">
      <div className="meter-circle">
        <svg width="80" height="80" className="progress-ring">
          <circle stroke="var(--glass-border)" strokeWidth="6" fill="transparent" r={radius} cx="40" cy="40" />
          <circle
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="score-text" style={{ color }}>{score}</div>
      </div>
      <div className="meter-label">Freshness Score</div>
    </div>
  );
};

const VitalsCard = ({ fruitType }) => {
  // Mock Vitals based on type
  const vitals = fruitType === 'Strawberry' ? [
    { label: 'Vit C', value: '58mg', icon: Activity },
    { label: 'Sugar', value: '4.9g', icon: Droplets },
    { label: 'Fiber', value: '2g', icon: Leaf },
  ] : [
    { label: 'Vit C', value: '4.6mg', icon: Activity },
    { label: 'Sugar', value: '10g', icon: Droplets },
    { label: 'Fiber', value: '2.4g', icon: Leaf },
  ];

  return (
    <div className="vitals-grid">
      {vitals.map((v, i) => (
        <div key={i} className="vital-item">
          <v.icon size={16} className="vital-icon" />
          <span className="vital-value">{v.value}</span>
          <span className="vital-label">{v.label}</span>
        </div>
      ))}
    </div>
  );
};

const Timeline = ({ events }) => {
  if (!events || events.length === 0) return <div className="no-events">No tracking events yet.</div>;
  return (
    <div className="timeline">
      {events.map((event, index) => (
        <div key={event.id} className="timeline-item">
          <div className="timeline-marker">
            <div className="dot"></div>
            {index !== events.length - 1 && <div className="line"></div>}
          </div>
          <div className="timeline-content">
            <div className="time">{new Date(event.timestamp).toLocaleString()}</div>
            <div className="event-title">{event.status}</div>
            <div className="event-location">
              <MapPin size={14} /> {event.location}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ConsumerDashboard = ({ batches = [] }) => { // Accept batches from props
  const [searchId, setSearchId] = useState('B-STRAW-2023-001');
  const [scannedBatch, setScannedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [daysSinceHarvest, setDaysSinceHarvest] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [freshnessData, setFreshnessData] = useState(null);

  // Initial load simulation
  useEffect(() => {
    handleSearch(null, 'B-STRAW-2023-001');
  }, []);

  const handleSearch = (e, overrideId) => {
    if (e) e.preventDefault();
    const idToSearch = overrideId || searchId;

    setLoading(true);
    setTimeout(() => {
      // Find batch in props
      const foundBatch = batches.find(b => b.id === idToSearch);

      if (foundBatch) {
        // Enrich with Farmer details (assuming FARMERS is global mock or passed, let's use global for simple lookup if not passed)
        // ideally we pass farmers prop too, but for consumer view keeping it simple to mockData import if mostly static
        const farmer = FARMERS.find(f => f.id === foundBatch.farmerId);

        // Calculate details
        const harvestDate = new Date(foundBatch.harvestDate);
        const diffTime = Math.abs(new Date() - harvestDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const freshStats = calculateFreshness(foundBatch.harvestDate);
        setFreshnessData(freshStats);

        setScannedBatch({ ...foundBatch, farmer, events: [] }); // Todo: mock events logic or pass it
        setDaysSinceHarvest(diffDays);
      } else {
        setScannedBatch(null);
      }
      setLoading(false);
    }, 600);
  };

  const handleScanSuccess = (decodedText) => {
    // If scanned text is a URL, extract the ID
    let batchId = decodedText;
    if (decodedText.includes('track/')) {
      const parts = decodedText.split('track/');
      if (parts.length > 1) {
        batchId = parts[1];
      }
    }

    setSearchId(batchId);
    setShowScanner(false);
    handleSearch(null, batchId);
  };

  return (
    <div className="consumer-view">
      {showScanner && (
        <div className="scanner-modal-overlay">
          <div className="scanner-modal">
            <button className="close-btn" onClick={() => setShowScanner(false)}>
              <X size={24} />
            </button>
            <h3>Scan Product QR Code</h3>
            <QRScanner onScanSuccess={handleScanSuccess} />
          </div>
        </div>
      )}

      <div className="search-section">
        <h2>Product Passport</h2>
        <div className="search-bar-wrapper">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Scan or Enter Batch ID..."
          />
          <button className="scan-btn" onClick={() => setShowScanner(true)} title="Scan QR Code">
            <Scan size={20} />
          </button>
          <button onClick={(e) => handleSearch(e)} disabled={loading}>
            {loading ? 'Scanning...' : <Search size={18} />}
          </button>
        </div>
      </div>

      {scannedBatch ? (
        <div className="passport-container">
          {/* Header Card */}
          <div className="glass-card product-header-card">
            <div className="product-badge">
              <span className="emoji">{scannedBatch.fruitType === 'Strawberry' ? '🍓' : '🍎'}</span>
            </div>
            <div className="product-titles">
              <span className="product-type">{scannedBatch.variety} {scannedBatch.fruitType}</span>
              <span className="product-id">ID: {scannedBatch.id}</span>
              <div className="age-badge">
                <Clock size={14} /> Harvested {daysSinceHarvest} days ago
              </div>
            </div>
            <div className="health-section">
              {freshnessData ? (
                <div className="freshness-wrapper">
                  <FreshnessGraph
                    data={freshnessData.curveData}
                    currentDay={freshnessData.daysPassed}
                    currentScore={freshnessData.currentScore}
                  />
                  <div className="days-remaining-badge">
                    <span className="dr-value">{freshnessData.daysRemaining}</span>
                    <span className="dr-label">Days Safe to Eat</span>
                  </div>
                </div>
              ) : (
                <HealthMeter score={scannedBatch.initialHealthScore || 95} />
              )}
            </div>
          </div>

          <div className="passport-grid">
            {/* Farm Origin Card */}
            <div className="glass-card origin-card">
              <h3><MapPin size={18} /> Origin Story</h3>
              {scannedBatch.farmer && (
                <div className="farmer-profile">
                  <img src={scannedBatch.farmer.avatar} alt="" className="avatar" />
                  <div className="farmer-text">
                    <div className="name">{scannedBatch.farmer.name}</div>
                    <div className="farm">{scannedBatch.farmer.farmName}</div>
                    <div className="loc">{scannedBatch.farmer.location}</div>
                  </div>
                  <div className="verified-badge">
                    <CheckCircle size={16} /> Verified
                  </div>
                </div>
              )}
              <div className="farm-description">
                "Grown with care using sustainable organic practices in the high-altitude fields."
              </div>
              <div style={{ height: '200px', marginTop: '16px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {scannedBatch.farmer && scannedBatch.farmer.coordinates ? (
                  <LiveMap
                    center={scannedBatch.farmer.coordinates}
                    zoom={10}
                    markers={[{ ...scannedBatch.farmer.coordinates, label: `${scannedBatch.farmer.farmName} (Origin)` }]}
                  />
                ) : (
                  <div className="map-placeholder" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Location Map Unavailable</span>
                  </div>
                )}
              </div>
            </div>

            {/* Nutrition / Vitals Card */}
            <div className="glass-card vitals-card">
              <h3><Activity size={18} /> Nutritional Vitals</h3>
              <VitalsCard fruitType={scannedBatch.fruitType} />
              <div className="disclaimer">*Values per 100g serving</div>
            </div>
          </div>
        </div>
      ) : (
        !loading && <div className="not-found">Batch not found. Try B-STRAW-2023-001</div>
      )}

    </div>
  );
};

export default ConsumerDashboard;
