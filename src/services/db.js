import { supabase } from './supabaseClient';
import { FARMERS, BATCHES, TRACKING_EVENTS } from './mockData';

// Helper to check if DB is connected
const isConnected = () => !!supabase && supabase.supabaseUrl && supabase.supabaseKey;

// Helper for LocalStorage
const getLocal = (key, defaultData) => {
    const stored = localStorage.getItem(key);
    if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(stored);
};

const setLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// --- Farmers ---

export const getFarmers = async () => {
    if (isConnected()) {
        const { data, error } = await supabase.from('farmers').select('*');
        if (!error && data) return data;
    }

    // Fallback to LocalStorage
    return getLocal('farmtrace_farmers', FARMERS);
};

export const addFarmer = async (farmer) => {
    if (isConnected()) {
        const { data, error } = await supabase
            .from('farmers')
            .insert([{
                id: farmer.id,
                name: farmer.name,
                location: farmer.location,
                farm_name: farmer.farmName,
                rating: farmer.rating,
                joined_date: farmer.joinedDate,
                avatar_url: farmer.avatar,
                aadhar_number: farmer.aadharNumber,
                phone: farmer.phone,
                is_verified: farmer.isVerified
            }])
            .select();

        if (!error) return data[0];
    }

    // LocalStorage Fallback
    const currentFarmers = getLocal('farmtrace_farmers', FARMERS);
    const updatedFarmers = [...currentFarmers, farmer];
    setLocal('farmtrace_farmers', updatedFarmers);
    return farmer;
};

// --- Batches ---

export const getBatches = async () => {
    if (isConnected()) {
        const { data, error } = await supabase.from('batches').select('*');
        if (!error && data) {
            return data.map(b => ({
                id: b.id,
                farmerId: b.farmer_id,
                fruitType: b.fruit_type,
                variety: b.variety,
                harvestDate: b.harvest_date,
                quantity: b.quantity,
                isColdStorageEnabled: b.is_cold_storage_enabled,
                initialHealthScore: b.initial_health_score,
                currentLocation: b.current_location,
                status: b.status,
                description: b.description
            }));
        }
    }

    // Fallback to LocalStorage
    return getLocal('farmtrace_batches', BATCHES);
};

export const createBatch = async (batch) => {
    if (isConnected()) {
        const { data, error } = await supabase
            .from('batches')
            .insert([{
                id: batch.id,
                farmer_id: batch.farmerId,
                fruit_type: batch.fruitType,
                variety: batch.variety,
                harvest_date: batch.harvestDate,
                quantity: batch.quantity,
                is_cold_storage_enabled: batch.isColdStorageEnabled,
                initial_health_score: batch.initialHealthScore,
                current_location: batch.currentLocation,
                status: batch.status,
                description: batch.description
            }])
            .select();

        if (!error) return data[0];
    }

    // LocalStorage Fallback
    const currentBatches = getLocal('farmtrace_batches', BATCHES);
    const updatedBatches = [batch, ...currentBatches];
    setLocal('farmtrace_batches', updatedBatches);
    return batch;
};
