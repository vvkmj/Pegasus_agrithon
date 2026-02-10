import React, { useState, useEffect } from 'react';
import { Download, Share } from 'lucide-react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator.standalone === true);

        setIsStandalone(isRunningStandalone);

        // Check if iOS (for manual instructions)
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(ios);

        // Capture the install prompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    if (isStandalone) return null; // Don't show if already installed

    // Android / Chrome Desktop
    if (deferredPrompt) {
        return (
            <button className="install-btn" onClick={handleInstallClick}>
                <Download size={18} /> Install App
            </button>
        );
    }

    // iOS Fallback (Instructions)
    if (isIOS) {
        return (
            <div className="ios-install-hint">
                <p>To install: Tap <Share size={14} style={{ display: 'inline' }} /> then "Add to Home Screen"</p>
            </div>
        );
    }

    return null;
};

export default InstallPrompt;
