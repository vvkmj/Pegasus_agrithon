import React, { useState } from 'react';
import { Bell, Search, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import './Header.css';

const Header = ({ user }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, type: 'alert', text: 'Batch #B-STRAW-001 temp high (8°C)', time: '10 min ago' },
        { id: 2, type: 'success', text: 'Batch #B-APPLE-088 Delivered', time: '1 hour ago' },
        { id: 3, type: 'info', text: 'New market prices available', time: '4 hours ago' }
    ];

    return (
        <header className="header glass-card">
            <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Search batch ID, fruit, or location..." />
            </div>

            <div className="header-actions">
                <div className="notification-wrapper">
                    <button
                        className={`icon-btn ${showNotifications ? 'active' : ''}`}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        <span className="notification-dot"></span>
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown glass-card">
                            <div className="dropdown-header">
                                <span>Notifications</span>
                                <button className="clear-btn">Mark all read</button>
                            </div>
                            <div className="notification-list">
                                {notifications.map(notif => (
                                    <div key={notif.id} className={`notification-item ${notif.type}`}>
                                        <div className="notif-icon">
                                            {notif.type === 'alert' && <AlertTriangle size={14} />}
                                            {notif.type === 'success' && <CheckCircle size={14} />}
                                            {notif.type === 'info' && <Info size={14} />}
                                        </div>
                                        <div className="notif-content">
                                            <p>{notif.text}</p>
                                            <span className="time">{notif.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">Farmer ID: {user.id}</span>
                    </div>
                    <img src={user.avatar} alt={user.name} className="avatar" />
                </div>
            </div>
        </header>
    );
};

export default Header;
