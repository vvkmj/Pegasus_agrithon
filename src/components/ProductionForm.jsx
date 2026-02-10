import React, { useState } from 'react';
import { Leaf, Calendar, Disc, Box } from 'lucide-react';
import './ProductionForm.css';

const ProductionForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        fruitType: 'Strawberry',
        variety: '',
        quantity: '',
        harvestDate: new Date().toISOString().split('T')[0],
        isColdStorageEnabled: false
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="glass-card form-card">
            <div className="card-header">
                <h3>Collect Harvest</h3>
                <p>Log a new batch collection from farmer</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label><Leaf size={16} /> Fruit Type</label>
                    <select name="fruitType" value={formData.fruitType} onChange={handleChange}>
                        <option value="Strawberry">Strawberry</option>
                        <option value="Apple">Apple</option>
                        <option value="Orange">Orange</option>
                        <option value="Grapes">Grapes</option>
                    </select>
                </div>

                <div className="form-group">
                    <label><Disc size={16} /> Variety</label>
                    <input
                        type="text"
                        name="variety"
                        placeholder="e.g. Winter Dawn"
                        value={formData.variety}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="row">
                    <div className="form-group">
                        <label><Box size={16} /> Quantity</label>
                        <input
                            type="text"
                            name="quantity"
                            placeholder="e.g. 50 Crates"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><Calendar size={16} /> Collection Date</label>
                        <input
                            type="date"
                            name="harvestDate"
                            value={formData.harvestDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Supplier Quality Note (Optional)</label>
                    <input
                        type="text"
                        placeholder="e.g. Grade A, checked for rot"
                        name="supplierNote"
                        value={formData.supplierNote}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="coldStorage"
                        name="isColdStorageEnabled"
                        checked={formData.isColdStorageEnabled}
                        onChange={handleChange}
                    />
                    <label htmlFor="coldStorage">Enable Cold Storage Tracking (+Health Score)</label>
                </div>

                <button type="submit" className="submit-btn">
                    Generate Batch & QR
                </button>
            </form>

        </div>
    );
};

export default ProductionForm;
