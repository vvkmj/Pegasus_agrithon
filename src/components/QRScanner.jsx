import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './QRScanner.css';

const QRScanner = ({ onScanSuccess, onScanFailure }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        // Initialize the scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText, decodedResult) => {
                // Clear the scanner on success
                scanner.clear().then(() => {
                    onScanSuccess(decodedText, decodedResult);
                }).catch((error) => {
                    console.error("Failed to clear scanner", error);
                });
            },
            (errorMessage) => {
                // parse error, ignore it.
                if (onScanFailure) {
                    onScanFailure(errorMessage);
                }
            }
        );

        // Cleanup function
        return () => {
            // We can't really destroy the scanner instance easily as it modifies the DOM directly.
            // But we can clear it.
            try {
                scanner.clear().catch(error => {
                    // Start failed, handle it
                });
            } catch (e) {
                // ignore
            }
        };
    }, []);

    return (
        <div className="qr-scanner-container">
            <div id="reader" width="100%"></div>
            <p className="scanner-instruction">Point camera at a QR code</p>
        </div>
    );
};

export default QRScanner;
