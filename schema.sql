
-- RENTO Database Schema

-- Drop tables if they exist to ensure clean setup
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS vehicle_images;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS renter_documents;
DROP TABLE IF EXISTS users;

-- Users Table (both owners and renters)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed password
    phone VARCHAR(20),
    role ENUM('owner', 'renter') NOT NULL,
    address TEXT,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Renter Documents (for verification)
CREATE TABLE renter_documents (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    document_type ENUM('driving_license', 'aadhar_card') NOT NULL,
    document_number VARCHAR(50) NOT NULL,
    document_image VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_date TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, document_type)
);

-- Vehicles Table
CREATE TABLE vehicles (
    id VARCHAR(36) PRIMARY KEY,
    owner_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 2-wheeler, 4-wheeler, 6-wheeler, etc.
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    price_per_week DECIMAL(10, 2),
    price_per_month DECIMAL(10, 2),
    location VARCHAR(100) NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    features JSON,  -- Store features as JSON array
    specifications JSON, -- Store specifications as JSON object
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Vehicle Images Table
CREATE TABLE vehicle_images (
    id VARCHAR(36) PRIMARY KEY,
    vehicle_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Bookings Table
CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY,
    vehicle_id VARCHAR(36) NOT NULL,
    renter_id VARCHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY,
    booking_id VARCHAR(36) NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    renter_id VARCHAR(36) NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (booking_id) -- One review per booking
);

-- Indices for performance
CREATE INDEX idx_vehicle_category ON vehicles(category);
CREATE INDEX idx_vehicle_brand ON vehicles(brand);
CREATE INDEX idx_vehicle_location ON vehicles(location);
CREATE INDEX idx_vehicle_availability ON vehicles(availability);
CREATE INDEX idx_booking_status ON bookings(status);
CREATE INDEX idx_booking_dates ON bookings(start_date, end_date);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- View to calculate average rating for each vehicle
CREATE VIEW vehicle_ratings AS
SELECT 
    vehicle_id,
    AVG(rating) AS average_rating,
    COUNT(*) AS review_count
FROM 
    reviews
GROUP BY 
    vehicle_id;

-- Sample data for testing (optional)
-- INSERT INTO users (id, name, email, password, role) VALUES
-- ('u1', 'John Owner', 'john@example.com', 'hashedpassword123', 'owner'),
-- ('u2', 'Jane Renter', 'jane@example.com', 'hashedpassword456', 'renter');
