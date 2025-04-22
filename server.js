
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from './db.js'; // Updated import

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// User Authentication
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    // Create new user
    await db.execute(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, role]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Renter Document Upload
app.post('/api/renters/documents', authenticateToken, upload.single('document'), async (req, res) => {
  try {
    const { documentType, documentNumber } = req.body;
    const userId = req.user.id;
    
    // Only renters can upload documents
    if (req.user.role !== 'renter') {
      return res.status(403).json({ error: 'Only renters can upload documents' });
    }
    
    // Check if document already exists
    const [existingDocs] = await db.execute(
      'SELECT * FROM renter_documents WHERE user_id = ? AND document_type = ?',
      [userId, documentType]
    );
    
    const documentId = uuidv4();
    const documentPath = req.file.path;
    
    if (existingDocs.length > 0) {
      // Update existing document
      await db.execute(
        'UPDATE renter_documents SET document_number = ?, document_image = ?, verified = FALSE, upload_date = CURRENT_TIMESTAMP WHERE user_id = ? AND document_type = ?',
        [documentNumber, documentPath, userId, documentType]
      );
    } else {
      // Create new document
      await db.execute(
        'INSERT INTO renter_documents (id, user_id, document_type, document_number, document_image) VALUES (?, ?, ?, ?, ?)',
        [documentId, userId, documentType, documentNumber, documentPath]
      );
    }
    
    res.status(201).json({ message: 'Document uploaded successfully' });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vehicle Management
app.post('/api/vehicles', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      model,
      year,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      location,
      features,
      specifications
    } = req.body;
    
    // Only owners can add vehicles
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Only owners can add vehicles' });
    }
    
    const vehicleId = uuidv4();
    const ownerId = req.user.id;
    
    // Create vehicle
    await db.execute(
      `INSERT INTO vehicles (
        id, owner_id, name, description, category, brand, model, year,
        price_per_day, price_per_week, price_per_month, location, features, specifications
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicleId, ownerId, name, description, category, brand, model, year,
        pricePerDay, pricePerWeek, pricePerMonth, location, 
        features ? JSON.stringify(features) : null,
        specifications ? JSON.stringify(specifications) : null
      ]
    );
    
    // Add primary image if uploaded
    if (req.file) {
      const imageId = uuidv4();
      const imagePath = req.file.path;
      
      await db.execute(
        'INSERT INTO vehicle_images (id, vehicle_id, image_url, is_primary) VALUES (?, ?, ?, ?)',
        [imageId, vehicleId, imagePath, true]
      );
    }
    
    res.status(201).json({
      message: 'Vehicle added successfully',
      vehicleId
    });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    let query = `
      SELECT v.*, 
        (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as image,
        COALESCE(vr.average_rating, 0) as rating,
        COALESCE(vr.review_count, 0) as review_count
      FROM vehicles v
      LEFT JOIN vehicle_ratings vr ON v.id = vr.vehicle_id
      WHERE v.availability = true
    `;
    
    const params = [];
    
    // Apply filters if provided
    if (req.query.category) {
      query += ' AND v.category = ?';
      params.push(req.query.category);
    }
    
    if (req.query.location) {
      query += ' AND v.location LIKE ?';
      params.push(`%${req.query.location}%`);
    }
    
    if (req.query.minPrice) {
      query += ' AND v.price_per_day >= ?';
      params.push(parseFloat(req.query.minPrice));
    }
    
    if (req.query.maxPrice) {
      query += ' AND v.price_per_day <= ?';
      params.push(parseFloat(req.query.maxPrice));
    }
    
    if (req.query.search) {
      query += ` AND (
        v.name LIKE ? OR
        v.brand LIKE ? OR
        v.model LIKE ? OR
        v.description LIKE ?
      )`;
      const searchParam = `%${req.query.search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }
    
    // Add sorting
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'DESC';
    query += ` ORDER BY v.${sortBy} ${sortOrder}`;
    
    const [vehicles] = await db.execute(query, params);
    
    // Format the response
    const formattedVehicles = vehicles.map(v => ({
      id: v.id,
      ownerId: v.owner_id,
      name: v.name,
      description: v.description,
      category: v.category,
      brand: v.brand,
      model: v.model,
      year: v.year,
      pricePerDay: v.price_per_day,
      pricePerWeek: v.price_per_week,
      pricePerMonth: v.price_per_month,
      location: v.location,
      image: v.image ? `/uploads/${path.basename(v.image)}` : null,
      rating: parseFloat(v.rating),
      reviewCount: v.review_count,
      features: v.features ? JSON.parse(v.features) : [],
      specifications: v.specifications ? JSON.parse(v.specifications) : {},
      availability: v.availability,
      createdAt: v.created_at
    }));
    
    res.status(200).json(formattedVehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single vehicle
app.get('/api/vehicles/:id', async (req, res) => {
  try {
    const vehicleId = req.params.id;
    
    // Get vehicle details
    const [vehicles] = await db.execute(
      `SELECT v.*, 
        COALESCE(vr.average_rating, 0) as rating,
        COALESCE(vr.review_count, 0) as review_count,
        u.name as owner_name
      FROM vehicles v
      LEFT JOIN vehicle_ratings vr ON v.id = vr.vehicle_id
      LEFT JOIN users u ON v.owner_id = u.id
      WHERE v.id = ?`,
      [vehicleId]
    );
    
    if (vehicles.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    const vehicle = vehicles[0];
    
    // Get vehicle images
    const [images] = await db.execute(
      'SELECT id, image_url, is_primary FROM vehicle_images WHERE vehicle_id = ?',
      [vehicleId]
    );
    
    // Get reviews
    const [reviews] = await db.execute(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name as renter_name
      FROM reviews r
      JOIN users u ON r.renter_id = u.id
      WHERE r.vehicle_id = ?
      ORDER BY r.created_at DESC`,
      [vehicleId]
    );
    
    // Format the response
    const formattedVehicle = {
      id: vehicle.id,
      ownerId: vehicle.owner_id,
      ownerName: vehicle.owner_name,
      name: vehicle.name,
      description: vehicle.description,
      category: vehicle.category,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      pricePerDay: vehicle.price_per_day,
      pricePerWeek: vehicle.price_per_week,
      pricePerMonth: vehicle.price_per_month,
      location: vehicle.location,
      images: images.map(img => ({
        id: img.id,
        url: `/uploads/${path.basename(img.image_url)}`,
        isPrimary: img.is_primary
      })),
      rating: parseFloat(vehicle.rating),
      reviewCount: vehicle.review_count,
      reviews: reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        renterName: r.renter_name,
        createdAt: r.created_at
      })),
      features: vehicle.features ? JSON.parse(vehicle.features) : [],
      specifications: vehicle.specifications ? JSON.parse(vehicle.specifications) : {},
      availability: vehicle.availability,
      createdAt: vehicle.created_at
    };
    
    res.status(200).json(formattedVehicle);
  } catch (error) {
    console.error('Get vehicle details error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Booking Management
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;
    const renterId = req.user.id;
    
    // Only renters can create bookings
    if (req.user.role !== 'renter') {
      return res.status(403).json({ error: 'Only renters can create bookings' });
    }
    
    // Check if vehicle exists and is available, and get owner_id
    const [vehicles] = await db.execute(
      'SELECT * FROM vehicles WHERE id = ? AND availability = true',
      [vehicleId]
    );
    
    if (vehicles.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found or not available' });
    }
    
    const vehicle = vehicles[0];
    const ownerId = vehicle.owner_id;

    // Check if vehicle is already booked for the selected dates
    const [existingBookings] = await db.execute(
      `SELECT * FROM bookings 
      WHERE vehicle_id = ? 
      AND status IN ('confirmed', 'pending')
      AND (
        (start_date <= ? AND end_date >= ?) OR
        (start_date <= ? AND end_date >= ?) OR
        (start_date >= ? AND end_date <= ?)
      )`,
      [vehicleId, startDate, startDate, endDate, endDate, startDate, endDate]
    );
    
    if (existingBookings.length > 0) {
      return res.status(400).json({ error: 'Vehicle is not available for the selected dates' });
    }
    
    // Calculate booking duration and total amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    let totalAmount;
    if (durationDays >= 30 && vehicle.price_per_month) {
      const months = Math.floor(durationDays / 30);
      const remainingDays = durationDays % 30;
      totalAmount = (months * vehicle.price_per_month) + (remainingDays * vehicle.price_per_day);
    } else if (durationDays >= 7 && vehicle.price_per_week) {
      const weeks = Math.floor(durationDays / 7);
      const remainingDays = durationDays % 7;
      totalAmount = (weeks * vehicle.price_per_week) + (remainingDays * vehicle.price_per_day);
    } else {
      totalAmount = durationDays * vehicle.price_per_day;
    }
    
    // Create booking
    const bookingId = uuidv4();
    await db.execute(
      `INSERT INTO bookings (
        id, vehicle_id, renter_id, start_date, end_date, total_amount, status, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [bookingId, vehicleId, renterId, startDate, endDate, totalAmount]
    );
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: bookingId,
        vehicleId,
        ownerId,
        renterId,
        startDate,
        endDate,
        totalAmount,
        status: 'pending',
        paymentStatus: 'pending'
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get bookings by user (Renter -> their own, Owner -> all requests for their vehicles, show ownerId)
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query;
    let params;
    
    if (userRole === 'renter') {
      // Get bookings for renter, JOIN vehicle and owner for display
      query = `
        SELECT b.*, v.name as vehicle_name, v.brand, v.model, v.owner_id,
          (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as vehicle_image,
          u.name as owner_name, u.email as owner_email
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        JOIN users u ON v.owner_id = u.id
        WHERE b.renter_id = ?
      `;
      params = [userId];
    } else {
      // Get bookings for owner, JOIN vehicle and renter for display
      query = `
        SELECT b.*, v.name as vehicle_name, v.brand, v.model, v.owner_id,
          (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as vehicle_image,
          u.name as renter_name, u.email as renter_email
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        JOIN users u ON b.renter_id = u.id
        WHERE v.owner_id = ?
      `;
      params = [userId];
    }
    
    // Apply status filter if provided
    if (req.query.status) {
      query += ' AND b.status = ?';
      params.push(req.query.status);
    }
    
    // Apply date filters if provided
    if (req.query.startDate) {
      query += ' AND b.start_date >= ?';
      params.push(req.query.startDate);
    }
    
    if (req.query.endDate) {
      query += ' AND b.end_date <= ?';
      params.push(req.query.endDate);
    }
    
    // Add sorting
    query += ' ORDER BY b.created_at DESC';
    
    const [bookings] = await db.execute(query, params);
    
    // Format the response for both renter and owner views
    const formattedBookings = bookings.map(b => ({
      id: b.id,
      vehicleId: b.vehicle_id,
      renterId: b.renter_id,
      ownerId: b.owner_id,
      startDate: b.start_date,
      endDate: b.end_date,
      totalAmount: b.total_amount,
      status: b.status,
      paymentStatus: b.payment_status,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
      vehicle: {
        name: b.vehicle_name,
        brand: b.brand,
        model: b.model,
        image: b.vehicle_image ? `/uploads/${path.basename(b.vehicle_image)}` : null
      },
      renter: userRole === 'owner'
        ? { name: b.renter_name, email: b.renter_email }
        : undefined,
      owner: userRole === 'renter'
        ? { name: b.owner_name, email: b.owner_email }
        : undefined
    }));
    
    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update booking status (accept/reject/cancel)
app.patch('/api/bookings/:id/status', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Check if booking exists
    const [bookings] = await db.execute(
      'SELECT b.*, v.owner_id FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.id = ?',
      [bookingId]
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const booking = bookings[0];
    
    // Verify user authorization
    if (userRole === 'owner' && booking.owner_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this booking' });
    }
    
    if (userRole === 'renter' && booking.renter_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this booking' });
    }
    
    // Validate status change
    const validStatusChanges = {
      owner: {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['completed', 'cancelled']
      },
      renter: {
        pending: ['cancelled'],
        confirmed: ['cancelled']
      }
    };
    
    if (!validStatusChanges[userRole][booking.status]?.includes(status)) {
      return res.status(400).json({ 
        error: `Cannot change booking status from '${booking.status}' to '${status}' as ${userRole}` 
      });
    }
    
    // Update booking status
    await db.execute(
      'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, bookingId]
    );
    
    res.status(200).json({
      message: 'Booking status updated successfully',
      status
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get owner's vehicles 
app.get('/api/vehicles/owner', authenticateToken, async (req, res) => {
  try {
    // Only owners can view their vehicles
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Only owners can access their vehicles' });
    }
    
    const ownerId = req.user.id;
    
    // Get vehicle details
    const [vehicles] = await db.execute(
      `SELECT v.*, 
        (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id AND is_primary = true LIMIT 1) as image,
        COALESCE(vr.average_rating, 0) as rating,
        COALESCE(vr.review_count, 0) as review_count
      FROM vehicles v
      LEFT JOIN vehicle_ratings vr ON v.id = vr.vehicle_id
      WHERE v.owner_id = ?`,
      [ownerId]
    );
    
    // Format the response
    const formattedVehicles = vehicles.map(v => ({
      id: v.id,
      ownerId: v.owner_id,
      name: v.name,
      description: v.description,
      category: v.category,
      brand: v.brand,
      model: v.model,
      year: v.year,
      pricePerDay: v.price_per_day,
      pricePerWeek: v.price_per_week,
      pricePerMonth: v.price_per_month,
      location: v.location,
      image: v.image ? `/uploads/${path.basename(v.image)}` : null,
      rating: parseFloat(v.rating),
      reviewCount: v.review_count,
      features: v.features ? JSON.parse(v.features) : [],
      specifications: v.specifications ? JSON.parse(v.specifications) : {},
      availability: v.availability === 1,
      createdAt: v.created_at
    }));
    
    res.status(200).json(formattedVehicles);
  } catch (error) {
    console.error('Get owner vehicles error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update vehicle availability
app.patch('/api/vehicles/:id/availability', authenticateToken, async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const { availability } = req.body;
    
    // Verify that user owns the vehicle
    const [vehicles] = await db.execute(
      'SELECT * FROM vehicles WHERE id = ? AND owner_id = ?',
      [vehicleId, req.user.id]
    );
    
    if (vehicles.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
    }
    
    // Update availability
    await db.execute(
      'UPDATE vehicles SET availability = ? WHERE id = ?',
      [availability, vehicleId]
    );
    
    res.status(200).json({ message: 'Vehicle availability updated successfully' });
  } catch (error) {
    console.error('Update vehicle availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a vehicle
app.delete('/api/vehicles/:id', authenticateToken, async (req, res) => {
  try {
    const vehicleId = req.params.id;
    
    // Verify that user owns the vehicle
    const [vehicles] = await db.execute(
      'SELECT * FROM vehicles WHERE id = ? AND owner_id = ?',
      [vehicleId, req.user.id]
    );
    
    if (vehicles.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
    }
    
    // Delete vehicle 
    await db.execute('DELETE FROM vehicles WHERE id = ?', [vehicleId]);
    
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Payment Processing
app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const { bookingId, method, amount } = req.body;
    const userId = req.user.id;
    
    // Verify booking exists and belongs to the user
    const [bookings] = await db.execute(
      'SELECT * FROM bookings WHERE id = ? AND renter_id = ?',
      [bookingId, userId]
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }
    
    // Create payment record
    const paymentId = uuidv4();
    await db.execute(
      'INSERT INTO payments (id, booking_id, amount, method, status) VALUES (?, ?, ?, ?, ?)',
      [paymentId, bookingId, amount, method, method === 'cash' ? 'pending' : 'completed']
    );
    
    // Update booking payment status and booking status if UPI
    await db.execute(
      'UPDATE bookings SET payment_status = ?, status = ? WHERE id = ?',
      [
        method === 'cash' ? 'pending' : 'completed',
        method === 'cash' ? 'pending' : 'confirmed',
        bookingId
      ]
    );
    
    res.status(201).json({
      message: 'Payment processed successfully',
      paymentId,
      status: method === 'cash' ? 'pending' : 'completed'
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate UPI Payment Link (simplified mock)
app.post('/api/payments/upi/generate', authenticateToken, async (req, res) => {
  try {
    const { bookingId, amount, description } = req.body;
    
    // In a real app, you would integrate with a payment gateway like Razorpay
    // For this demo, we'll just create a mock payment link
    
    const paymentId = uuidv4();
    const paymentLink = `https://mockpayment.com/pay/${paymentId}?amount=${amount}&description=${encodeURIComponent(description)}`;
    
    // Store payment information
    await db.execute(
      'INSERT INTO payments (id, booking_id, amount, method, status, payment_link) VALUES (?, ?, ?, ?, ?, ?)',
      [paymentId, bookingId, amount, 'upi', 'pending', paymentLink]
    );
    
    res.status(200).json({
      paymentId,
      paymentLink,
      amount,
      message: 'UPI payment link generated successfully'
    });
  } catch (error) {
    console.error('UPI link generation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify UPI Payment
app.get('/api/payments/upi/verify/:paymentId', authenticateToken, async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    
    // In a real app, you would check with payment gateway about status
    // For this demo, we'll simulate success
    
    // Update payment status
    await db.execute(
      'UPDATE payments SET status = ? WHERE id = ?',
      ['completed', paymentId]
    );
    
    // Get booking ID from payment
    const [payments] = await db.execute(
      'SELECT booking_id FROM payments WHERE id = ?',
      [paymentId]
    );
    
    if (payments.length > 0) {
      const bookingId = payments[0].booking_id;
      
      // Update booking status and payment status
      await db.execute(
        'UPDATE bookings SET status = ?, payment_status = ? WHERE id = ?',
        ['confirmed', 'completed', bookingId]
      );
    }
    
    res.status(200).json({
      verified: true,
      status: 'completed',
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Payment Status
app.get('/api/payments/status/:bookingId', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    
    // Get payment details
    const [payments] = await db.execute(
      'SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC LIMIT 1',
      [bookingId]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    const payment = payments[0];
    
    res.status(200).json({
      paymentId: payment.id,
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      createdAt: payment.created_at
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
