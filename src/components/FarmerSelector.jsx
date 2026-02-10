import React, { useState } from 'react';
import { Users, Search, ChevronDown, Check } from 'lucide-react';
import './FarmerSelector.css';

const FarmerSelector = ({ farmers, selectedFarmerId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId);

  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="farmer-selector-container">
      <label className="selector-label">Collection For:</label>
      <div className="custom-select" onClick={() => setIsOpen(!isOpen)}>
        <div className="selected-value">
          {selectedFarmer ? (
            <>
              <img src={selectedFarmer.avatar} alt="" className="mini-avatar" />
              <div className="farmer-info">
                <span className="name">{selectedFarmer.name}</span>
                <span className="id">{selectedFarmer.id}</span>
              </div>
            </>
          ) : (
            <span className="placeholder">Select a Farmer...</span>
          )}
        </div>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && (
        <div className="dropdown-menu glass-card">
          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          <div className="options-list">
            {filteredFarmers.map(farmer => (
              <div
                key={farmer.id}
                className={`option-item ${selectedFarmerId === farmer.id ? 'active' : ''}`}
                onClick={() => { onSelect(farmer.id); setIsOpen(false); }}
              >
                <img src={farmer.avatar} alt="" className="mini-avatar" />
                <div className="farmer-info">
                  <span className="name">{farmer.name}</span>
                  <span className="id">{farmer.id}</span>
                </div>
                {selectedFarmerId === farmer.id && <Check size={16} className="check-icon" />}
              </div>
            ))}
            {filteredFarmers.length === 0 && (
              <div className="no-results">No farmers found</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerSelector;
