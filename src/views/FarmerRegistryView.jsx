import React, { useState } from 'react';
import { Search, Plus, MapPin, Phone, Shield, CheckCircle, X, Loader, UserPlus, ShieldCheck, ShieldAlert } from 'lucide-react';
import { addFarmer } from '../services/db';
import './FarmerRegistryView.css';

const VerificationModal = ({ farmer, onClose, onVerify }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call to Aadhar backend
        setTimeout(() => {
            onVerify(farmer.id);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="modal-overlay">
            <div className="glass-card modal-content">
                <h3>Verify Farmer Identity</h3>
                <p className="subtitle">Aadhar Verification for {farmer.name}</p>

                <div className="aadhar-display">
                    <span>Aadhar Number:</span>
                    <span className="number">{farmer.aadharNumber}</span>
                </div>

                <form onSubmit={handleVerify}>
                    <div className="form-group">
                        <label>Enter OTP sent to registered mobile</label>
                        <input
                            type="text"
                            placeholder="e.g. 123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="otp-input"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Identity'}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};

const FarmerRegistryView = ({ farmers, setFarmers }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [verifyingFarmer, setVerifyingFarmer] = useState(null);
    const [newFarmer, setNewFarmer] = useState({ name: '', location: '', farmName: '', aadharNumber: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddFarmer = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const farmer = {
            id: `F${Date.now()}`,
            ...newFarmer,
            rating: 0,
            joinedDate: new Date().toISOString().split('T')[0],
            isVerified: false,
            avatar: 'https://via.placeholder.com/150'
        };

        const savedFarmer = await addFarmer(farmer);

        if (savedFarmer) {
            setFarmers([savedFarmer, ...farmers]);
            setShowAddForm(false);
            setNewFarmer({ name: '', location: '', farmName: '', aadharNumber: '', phone: '' });
        }
        setIsSubmitting(false);
    };

    const handleVerificationComplete = (id) => {
        setFarmers(farmers.map(f => f.id === id ? { ...f, isVerified: true } : f));
        setVerifyingFarmer(null);
    };

    return (
        <div className="registry-view">
            <div className="view-header">
                <h2>Farmer Registry</h2>
                <button className="add-btn" onClick={() => setShowAddForm(true)}>
                    <UserPlus size={18} /> Onboard Farmer
                </button>
            </div>

            {showAddForm && (
                <div className="glass-card add-form-card">
                    <h3>New Farmer Registration</h3>
                    <form onSubmit={handleAddFarmer} className="grid-form">
                        <input placeholder="Full Name" value={newFarmer.name} onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })} required />
                        <input placeholder="Farm Name" value={newFarmer.farmName} onChange={e => setNewFarmer({ ...newFarmer, farmName: e.target.value })} required />
                        <input placeholder="Location" value={newFarmer.location} onChange={e => setNewFarmer({ ...newFarmer, location: e.target.value })} required />
                        <input placeholder="Phone Number" value={newFarmer.phone} onChange={e => setNewFarmer({ ...newFarmer, phone: e.target.value })} required />
                        <input placeholder="Aadhar Number (xxxx xxxx xxxx)" value={newFarmer.aadharNumber} onChange={e => setNewFarmer({ ...newFarmer, aadharNumber: e.target.value })} required />

                        <div className="form-actions">
                            <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                            <button type="submit" className="save-btn">Register</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="farmers-grid">
                {farmers.map(farmer => (
                    <div key={farmer.id} className="glass-card farmer-card">
                        <div className="card-header">
                            <div className="info">
                                <h4>{farmer.name}</h4>
                                <span className="id-badge">ID: {farmer.id}</span>
                            </div>
                            {farmer.isVerified ? (
                                <div className="badge verified" title="Verified via Aadhar">
                                    <ShieldCheck size={16} /> Verified
                                </div>
                            ) : (
                                <button className="badge verify-btn" onClick={() => setVerifyingFarmer(farmer)}>
                                    <ShieldAlert size={16} /> Verify Now
                                </button>
                            )}
                        </div>

                        <div className="details">
                            <div className="detail-item"><MapPin size={14} /> {farmer.location}</div>
                            <div className="detail-item"><Phone size={14} /> {farmer.phone}</div>
                            <div className="detail-item aadhar">Aadhar: {farmer.aadharNumber || 'Not provided'}</div>
                        </div>
                    </div>
                ))}
            </div>

            {verifyingFarmer && (
                <VerificationModal
                    farmer={verifyingFarmer}
                    onClose={() => setVerifyingFarmer(null)}
                    onVerify={handleVerificationComplete}
                />
            )}

        </div>
    );
};

export default FarmerRegistryView;
