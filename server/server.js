const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:5500', // Live Server extension
            'http://localhost:5500',  // Live Server extension
            'http://127.0.0.1:3000',  // Common dev server
            'http://localhost:8080',  // Common dev server
            'http://127.0.0.1:8080'   // Common dev server
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let db;

// Initialize database connection
async function initDB() {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database');
        
        // Create tables if they don't exist
        await createTables();
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

// Create database tables
async function createTables() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL,
            subject VARCHAR(200) NOT NULL,
            message TEXT NOT NULL,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status ENUM('pending', 'read', 'replied', 'archived') DEFAULT 'pending'
        )`,
        
        `CREATE TABLE IF NOT EXISTS testimonials (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL,
            message TEXT NOT NULL,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_approved BOOLEAN DEFAULT FALSE
        )`,
        
        `CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            image_url VARCHAR(500),
            category VARCHAR(50),
            technologies TEXT,
            github_url VARCHAR(500),
            live_url VARCHAR(500),
            stars INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        
        `CREATE TABLE IF NOT EXISTS skills (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            level INT NOT NULL CHECK (level >= 0 AND level <= 100),
            category VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        
        `CREATE TABLE IF NOT EXISTS visitors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ip_address VARCHAR(45),
            user_agent TEXT,
            page_visited VARCHAR(200),
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    for (const query of queries) {
        await db.execute(query);
    }
    
    console.log('Database tables created/verified');
}

// Email transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Middleware to log visitor activity
app.use(async (req, res, next) => {
    try {
        if (req.path.startsWith('/api/')) {
            await db.execute(
                'INSERT INTO visitors (ip_address, user_agent, page_visited) VALUES (?, ?, ?)',
                [req.ip, req.get('User-Agent'), req.path]
            );
        }
    } catch (error) {
        console.error('Error logging visitor:', error);
    }
    next();
});

// API Routes

// Contact form endpoint
app.post('/api/contact', [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters long'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { name, email, subject, message } = req.body;

    try {
        // Save to database first
        const [result] = await db.execute(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );

        // Try to send email notification (optional - don't fail if email fails)
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: process.env.EMAIL_USER,
                subject: `New Contact Form Submission: ${subject}`,
                html: `
                    <h2>New Contact Message</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                    <hr>
                    <p><em>This message was sent from your portfolio website contact form.</em></p>
                `
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.warn('Email sending failed, but message was saved to database:', emailError);
        }

        res.json({
            success: true,
            message: 'Message sent successfully! I\'ll get back to you soon.'
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again.'
        });
    }
});

// Get all contact messages (admin endpoint)
app.get('/api/contact/messages', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, name, email, subject, message, date_created, status FROM contact_messages ORDER BY date_created DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Testimonials endpoints
app.get('/api/testimonials', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, name, email, message, date_created, is_approved FROM testimonials ORDER BY date_created DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/testimonials', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('message').trim().isLength({ min: 20 }).withMessage('Testimonial must be at least 20 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { name, email, message } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO testimonials (name, email, message, is_approved) VALUES (?, ?, ?, FALSE)',
            [name, email, message]
        );

        res.json({
            success: true,
            message: 'Thank you for your feedback! Your testimonial has been submitted for approval.'
        });
    } catch (error) {
        console.error('Error adding testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin endpoint to manage testimonials
app.get('/api/admin/testimonials', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, name, email, message, date_created, is_approved FROM testimonials ORDER BY date_created DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching testimonials for admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/admin/testimonials/:id/status', async (req, res) => {
    const { id } = req.params;
    const { is_approved } = req.body;

    if (typeof is_approved !== 'boolean') {
        return res.status(400).json({ error: 'Invalid status. Use true for approved, false for pending.' });
    }

    try {
        await db.execute(
            'UPDATE testimonials SET is_approved = ? WHERE id = ?',
            [is_approved, id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating testimonial status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update contact message status
app.put('/api/contact/messages/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'replied'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        await db.execute(
            'UPDATE contact_messages SET status = ? WHERE id = ?',
            [status, id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Projects endpoints
app.get('/api/projects', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM projects ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/projects', [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().optional(),
    body('category').trim().optional(),
    body('technologies').trim().optional(),
    body('github_url').isURL().optional(),
    body('live_url').isURL().optional()
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { title, description, image_url, category, technologies, github_url, live_url, stars } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO projects (title, description, image_url, category, technologies, github_url, live_url, stars) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, image_url, category, technologies, github_url, live_url, stars || 0]
        );

        res.json({
            success: true,
            message: 'Project added successfully',
            projectId: result.insertId
        });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Skills endpoints
app.get('/api/skills', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM skills ORDER BY level DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/skills', [
    body('name').trim().notEmpty().withMessage('Skill name is required'),
    body('level').isInt({ min: 0, max: 100 }).withMessage('Level must be between 0 and 100'),
    body('category').trim().optional()
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { name, level, category } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO skills (name, level, category) VALUES (?, ?, ?)',
            [name, level, category || null]
        );

        res.json({
            success: true,
            message: 'Skill added successfully',
            skillId: result.insertId
        });
    } catch (error) {
        console.error('Error adding skill:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
    try {
        const [totalVisitors] = await db.execute(
            'SELECT COUNT(*) as count FROM visitors'
        );
        
        const [uniqueVisitors] = await db.execute(
            'SELECT COUNT(DISTINCT ip_address) as count FROM visitors'
        );
        
        const [pageViews] = await db.execute(
            'SELECT page_visited, COUNT(*) as count FROM visitors GROUP BY page_visited ORDER BY count DESC'
        );

        res.json({
            totalVisitors: totalVisitors[0].count,
            uniqueVisitors: uniqueVisitors[0].count,
            pageViews: pageViews
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve static files (for frontend)
app.use(express.static('../'));

// Catch-all handler for frontend routing
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '../' });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : error.message
    });
});

// Start server
async function startServer() {
    await initDB();
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    if (db) {
        db.end();
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    if (db) {
        db.end();
    }
    process.exit(0);
});