-- Farmers Table
CREATE TABLE farmers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  farm_name TEXT,
  rating NUMERIC DEFAULT 0,
  joined_date DATE DEFAULT CURRENT_DATE,
  avatar_url TEXT,
  aadhar_number TEXT,
  phone TEXT,
  is_verified BOOLEAN DEFAULT FALSE
);

-- Batches Table
CREATE TABLE batches (
  id TEXT PRIMARY KEY,
  farmer_id TEXT REFERENCES farmers(id),
  fruit_type TEXT NOT NULL,
  variety TEXT,
  harvest_date TIMESTAMPTZ,
  quantity TEXT,
  is_cold_storage_enabled BOOLEAN DEFAULT FALSE,
  initial_health_score NUMERIC DEFAULT 100,
  current_location TEXT,
  status TEXT,
  description TEXT
);

-- Events Table
CREATE TABLE tracking_events (
  id TEXT PRIMARY KEY,
  batch_id TEXT REFERENCES batches(id),
  status TEXT,
  location TEXT,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  temperature TEXT,
  description TEXT
);
