/**
 * Mock Data Service for Fruit Tracking Application
 * 
 * Data Models:
 * - Farmer: Profile information for the producer
 * - Batch: Specific harvest unit (e.g., a crate of strawberries)
 * - TrackingEvent: Scanning points along the supply chain
 * - HealthMetrics: Calculated score based on various factors
 */

export const FARMERS = [
    {
        id: 'F001',
        name: 'Rajesh Kumar',
        location: 'Mahabaleshwar, Maharashtra',
        coordinates: { lat: 17.9237, lng: 73.6586 },
        farmName: 'Kumar Organic Berry Farm',
        rating: 4.8,
        joinedDate: '2021-03-15',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?bg=203020&fit=crop&q=80&w=200&h=200',
        aadharNumber: '4589 1234 5678',
        phone: '+91 98765 43210',
        isVerified: true
    },
    {
        id: 'F002',
        name: 'Sunita Devi',
        location: 'Shimla, Himachal Pradesh',
        coordinates: { lat: 31.1048, lng: 77.1734 },
        farmName: 'Himalayan Apple Orchards',
        rating: 4.9,
        joinedDate: '2020-08-22',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?bg=203020&fit=crop&q=80&w=200&h=200',
        aadharNumber: '7890 2345 6789',
        phone: '+91 87654 32109',
        isVerified: true
    }
];

export const SUPPLIER = {
    id: 'S001',
    name: 'CleanGreen Aggregators',
    location: 'Mumbai Central Hub',
    role: 'SUPPLIER',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?bg=203020&fit=crop&q=80&w=200&h=200'
};

export const BATCHES = [
    {
        id: 'B-STRAW-2023-001',
        farmerId: 'F001',
        fruitType: 'Strawberry',
        variety: 'Winter Dawn',
        harvestDate: '2023-11-20T06:30:00',
        quantity: '50 crates',
        isColdStorageEnabled: true,
        initialHealthScore: 100,
        currentLocation: 'Mumbai Distribution Hub',
        currentLocationCoordinates: { lat: 19.0760, lng: 72.8777 },
        status: 'IN_TRANSIT',
        description: 'Premium Grade A strawberries, hand-picked.'
    },
    {
        id: 'B-APPLE-2023-088',
        farmerId: 'F002',
        fruitType: 'Apple',
        variety: 'Royal Delicious',
        harvestDate: '2023-10-15T08:00:00',
        quantity: '200 boxes',
        isColdStorageEnabled: true,
        initialHealthScore: 100,
        currentLocation: 'Delhi Retail Store',
        currentLocationCoordinates: { lat: 28.7041, lng: 77.1025 },
        status: 'DELIVERED',
        description: 'Crisp and sweet apples from high-altitude orchards.'
    }
];

export const TRACKING_EVENTS = {
    'B-STRAW-2023-001': [
        {
            id: 'EVT-001',
            batchId: 'B-STRAW-2023-001',
            status: 'HARVESTED',
            location: 'Kumar Organic Berry Farm, Mahabaleshwar',
            timestamp: '2023-11-20T06:30:00',
            temperature: '18°C',
            description: 'Batch harvested and registered.'
        },
        {
            id: 'EVT-002',
            batchId: 'B-STRAW-2023-001',
            status: 'PACKED',
            location: 'Mahabaleshwar Packaging Center',
            timestamp: '2023-11-20T10:15:00',
            temperature: '12°C',
            description: 'Sorted, graded, and packed in eco-friendly crates.'
        },
        {
            id: 'EVT-003',
            batchId: 'B-STRAW-2023-001',
            status: 'SHIPPED',
            location: 'Mahabaleshwar Logistics Hub',
            timestamp: '2023-11-20T14:00:00',
            temperature: '4°C',
            description: 'Loaded into refrigerated truck (KA-01-AB-1234).'
        }
    ],
    'B-APPLE-2023-088': [
        {
            id: 'EVT-010',
            batchId: 'B-APPLE-2023-088',
            status: 'DELIVERED',
            location: 'Delhi Retail Store',
            timestamp: '2023-10-20T09:00:00',
            temperature: '20°C',
            description: 'Delivered to retailer.'
        }
    ]
};

// Simulation of Health Score Degradation
// In a real app, this would be a complex algorithm on the backend.
export const calculateHealthScore = (batch) => {
    const now = new Date();
    const harvestDate = new Date(batch.harvestDate);
    const hoursSinceHarvest = (now - harvestDate) / (1000 * 60 * 60);

    // Degradation rates (percent per hour)
    const degradationRates = {
        'Strawberry': 0.8, // Sensitive
        'Apple': 0.1,      // Robust
    };

    const baseRate = degradationRates[batch.fruitType] || 0.5;
    const storageBonus = batch.isColdStorageEnabled ? 0.5 : 1; // Half degradation if cold stored

    // Mock calculation
    let score = 100 - (hoursSinceHarvest * baseRate * storageBonus);

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
};

export const getBatchDetails = (batchId) => {
    const batch = BATCHES.find(b => b.id === batchId);
    const events = TRACKING_EVENTS[batchId] || [];
    const farmer = batch ? FARMERS.find(f => f.id === batch.farmerId) : null;

    if (!batch) return null;

    return {
        ...batch,
        events,
        farmer,
        healthScore: calculateHealthScore(batch)
    };
};
