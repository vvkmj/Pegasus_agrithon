import React, { useState } from 'react';
import { Activity, CheckCircle, AlertTriangle, Thermometer, ClipboardCheck } from 'lucide-react';
import { BATCHES } from '../services/mockData';
import './QualityControlView.css';

const QCLogForm = ({ batchId, onClose, onSubmit }) => {
  const [result, setResult] = useState('PASSED');
  const [notes, setNotes] = useState('');
  const [temperature, setTemperature] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ batchId, result, notes, temperature, timestamp: new Date().toISOString() });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content">
        <h3>Log QC Check</h3>
        <p className="subtitle">Batch: {batchId}</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Result</label>
            <div className="radio-group">
              <label className={`radio-option ${result === 'PASSED' ? 'selected pass' : ''}`}>
                <input
                  type="radio"
                  name="result"
                  value="PASSED"
                  checked={result === 'PASSED'}
                  onChange={(e) => setResult(e.target.value)}
                />
                <CheckCircle size={18} /> Passed
              </label>
              <label className={`radio-option ${result === 'ISSUE' ? 'selected fail' : ''}`}>
                <input
                  type="radio"
                  name="result"
                  value="ISSUE"
                  checked={result === 'ISSUE'}
                  onChange={(e) => setResult(e.target.value)}
                />
                <AlertTriangle size={18} /> Issue Found
              </label>
            </div>
          </div>

          <div className="form-group">
            <label><Thermometer size={16} /> Temperature (°C)</label>
            <input
              type="text"
              placeholder="e.g. 4.5"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              rows="3"
              placeholder="Describe observation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Save Log</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const QualityControlView = ({ user }) => {
  const [batches, setBatches] = useState(BATCHES.filter(b => b.farmerId === user.id));
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  const handleQCSubmit = (log) => {
    // In a real app, send to API
    console.log('QC Logged:', log);
    alert(`QC Check logged for ${log.batchId}`);
    setSelectedBatchId(null);
  };

  return (
    <div className="qc-view">
      <div className="qc-header">
        <h2>Quality Control</h2>
        <p>Monitor active batch health and perform checks.</p>
      </div>

      <div className="batches-table glass-card">
        <div className="table-header">
          <span>Batch ID</span>
          <span>Fruit</span>
          <span>Harvest Date</span>
          <span>Health Score</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {batches.map(batch => (
          <div key={batch.id} className="table-row">
            <span className="mono">{batch.id}</span>
            <span>{batch.fruitType}</span>
            <span>{new Date(batch.harvestDate).toLocaleDateString()}</span>
            <span>
              <span className={`health-badge ${batch.initialHealthScore > 80 ? 'good' : 'warn'}`}>
                {batch.initialHealthScore}%
              </span>
            </span>
            <span>{batch.status.replace('_', ' ')}</span>
            <span>
              <button
                className="qc-btn"
                onClick={() => setSelectedBatchId(batch.id)}
              >
                <ClipboardCheck size={16} /> Log Check
              </button>
            </span>
          </div>
        ))}
      </div>

      {selectedBatchId && (
        <QCLogForm
          batchId={selectedBatchId}
          onClose={() => setSelectedBatchId(null)}
          onSubmit={handleQCSubmit}
        />
      )}

    </div>
  );
};

export default QualityControlView;
