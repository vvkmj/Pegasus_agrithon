import React, { useState } from 'react';
import { User, Bell, Moon, Shield, Save } from 'lucide-react';
import './SettingsView.css';

const SettingsView = ({ user }) => {
  const [profile, setProfile] = useState({
    name: user.name,
    farmName: user.farmName || 'My Farm',
    location: user.location,
    email: 'farmer@example.com'
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="settings-view">
      <h2>Settings & Profile</h2>

      <div className="settings-grid">
        {/* Profile Card */}
        <div className="glass-card section-card">
          <div className="card-header">
            <User size={20} />
            <h3>Farmer Profile</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Farm Name</label>
              <input type="text" name="farmName" value={profile.farmName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={profile.location} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} />
            </div>

            <button className="save-btn">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="glass-card section-card">
          <div className="card-header">
            <Shield size={20} />
            <h3>Preferences</h3>
          </div>

          <div className="toggles-list">
            <div className="toggle-item">
              <div className="toggle-info">
                <div className="label"><Moon size={16} /> Dark Mode</div>
                <div className="desc">Use the dark theme (Default)</div>
              </div>
              <div className="switch on"></div>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <div className="label"><Bell size={16} /> Notifications</div>
                <div className="desc">Receive alerts for batch updates</div>
              </div>
              <div className="switch on"></div>
            </div>

            <div className="toggle-item">
              <div className="toggle-info">
                <div className="label">Public Profile</div>
                <div className="desc">Allow consumers to view farm details</div>
              </div>
              <div className="switch on"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SettingsView;
