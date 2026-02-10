import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Share2 } from 'lucide-react';
import './QRCodeCard.css';

const QRCodeCard = ({ batch }) => {
    if (!batch) return null;

    // URL that consumers would scan (mocked for now)
    const trackUrl = `${window.location.origin}/track/${batch.id}`;

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `FarmTrace Batch ${batch.id}`,
                    text: `Track freshness for batch ${batch.id}`,
                    url: trackUrl
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(trackUrl);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="glass-card qr-card" id="printable-qr-card">
            <div className="qr-header">
                <span className="batch-id">{batch.id}</span>
                <span className="status-badge">{batch.status}</span>
            </div>

            <div className="qr-code-container">
                <div className="qr-frame">
                    <QRCodeSVG
                        value={trackUrl}
                        size={180}
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#000000"
                        includeMargin={true}
                    />
                </div>
                <div className="scan-label">Scan to Verify Freshness</div>
            </div>

            <div className="batch-details">
                <div className="detail-row">
                    <span className="label">Fruit</span>
                    <span className="value">{batch.fruitType} ({batch.variety})</span>
                </div>
                <div className="detail-row">
                    <span className="label">Harvested</span>
                    <span className="value">{new Date(batch.harvestDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                    <span className="label">Health Score</span>
                    <span className="value score">{batch.initialHealthScore}%</span>
                </div>
            </div>

            {/* Hidden Shopping Label Structure for Print */}
            <div className="shipping-label">
                <div className="sl-header">
                    <div className="sl-brand">
                        <span className="sl-logo-text">FarmTrace</span> Logistics
                    </div>
                    <div className="sl-priority">
                        <span>PRIORITY SHIPPING</span>
                    </div>
                </div>

                <div className="sl-body">
                    <div className="sl-qr-section">
                        <QRCodeSVG
                            value={trackUrl}
                            size={160}
                            level="H"
                        />
                        <span className="sl-scan-hint">SCAN TO TRACK</span>
                    </div>
                    <div className="sl-info-section">
                        <div className="sl-batch-id">{batch.id}</div>

                        <div className="sl-address-block">
                            <span className="sl-label-small">TO:</span>
                            <div className="sl-address-text">
                                <strong>AGGREGATOR HUB</strong><br />
                                MUMBAI CENTRAL DIST.<br />
                                MAHARASHTRA, 400001
                            </div>
                        </div>

                        <div className="sl-address-block">
                            <span className="sl-label-small">FROM:</span>
                            <div className="sl-address-text">
                                {batch.farmerId} (PRODUCER)<br />
                                {new Date(batch.harvestDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sl-footer">
                    <div className="sl-product-details">
                        <span className="sl-detail-item">{batch.fruitType.toUpperCase()}</span>
                        <span className="sl-detail-item">{batch.variety.toUpperCase()}</span>
                        <span className="sl-detail-item">QTY: {batch.quantity || '1 UNIT'}</span>
                    </div>
                    <div className="sl-handling">
                        <span>PERISHABLE - KEEP COOL</span>
                    </div>
                    <div className="sl-barcode-sim">
                        {/* CSS Barcode Simulation */}
                        <div className="barcode-strip"></div>
                        <span className="sl-tracking-num">TRK-{batch.id.replace(/-/g, '')}</span>
                    </div>
                </div>
            </div>

            <div className="card-actions">
                <button className="action-btn" onClick={handlePrint}>
                    <Printer size={18} /> Print Label
                </button>
                <button className="action-btn" onClick={handleShare}>
                    <Share2 size={18} /> Share
                </button>
            </div>

        </div>
    );
};

export default QRCodeCard;
