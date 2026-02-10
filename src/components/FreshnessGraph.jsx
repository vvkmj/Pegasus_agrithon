import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceDot,
    ReferenceArea
} from 'recharts';
import './FreshnessGraph.css';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="tooltip-label">{`Day ${label}`}</p>
                <p className="tooltip-score">Health: {payload[0].value}%</p>
            </div>
        );
    }
    return null;
};

const FreshnessGraph = ({ data, currentDay, currentScore }) => {

    // Safe bounds for the reference dot
    const safeDay = Math.min(Math.max(0, currentDay), data[data.length - 1].day);

    return (
        <div className="freshness-graph-container">
            <div className="graph-header">
                <h4>Predicted Freshness Decay</h4>
                <div className="legend">
                    <span className="dot current"></span> You are here
                </div>
            </div>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="day"
                            stroke="rgba(255,255,255,0.5)"
                            label={{ value: 'Days Since Harvest', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            domain={[0, 100]}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Zones - Visual indicators of quality */}
                        <ReferenceArea y1={0} y2={40} fill="rgba(239, 68, 68, 0.1)" stroke="none" />
                        <ReferenceArea y1={40} y2={70} fill="rgba(234, 179, 8, 0.1)" stroke="none" />
                        <ReferenceArea y1={70} y2={100} fill="rgba(34, 197, 94, 0.1)" stroke="none" />

                        {/* The Decay Curve */}
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="var(--color-primary-blue)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={false}
                        />

                        {/* Current Status Dot */}
                        <ReferenceDot
                            x={safeDay}
                            y={currentScore}
                            r={6}
                            fill="white"
                            stroke="var(--color-primary-blue)"
                            strokeWidth={2}
                            isFront={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FreshnessGraph;
