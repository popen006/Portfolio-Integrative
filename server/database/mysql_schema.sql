-- MySQL Database Schema for Portfolio Website
-- This schema includes tables for testimonials and contact messages

-- Create the database (uncomment if you want to create a new database)
-- CREATE DATABASE IF NOT EXISTS portfolio_db;
-- USE portfolio_db;

-- Table for storing testimonials from visitors
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    INDEX idx_date (date_created),
    INDEX idx_approved (is_approved)
);

-- Table for storing contact form messages
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'read', 'replied', 'archived') DEFAULT 'pending',
    INDEX idx_date (date_created),
    INDEX idx_status (status)
);

-- Optional: Table for storing project information (if you want to manage projects via database)
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(50) DEFAULT 'other',
    technologies TEXT,
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    stars INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active)
);

-- Optional: Table for storing skills/technologies
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'other',
    proficiency INT DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_category (category),
    INDEX idx_active (is_active)
);

-- Insert some sample data for skills (optional)
INSERT INTO skills (name, category, proficiency) VALUES
('HTML', 'frontend', 90),
('CSS', 'frontend', 85),
('JavaScript', 'frontend', 75),
('React', 'frontend', 60),
('Node.js', 'backend', 60),
('PHP', 'backend', 75),
('MySQL', 'database', 65),
('Git & GitHub', 'tools', 80),
('VS Code', 'tools', 85),
('Figma', 'tools', 60),
('Terminal', 'tools', 70);

-- Create a view for easy access to approved testimonials (optional)
CREATE VIEW approved_testimonials AS
SELECT id, name, email, message, date_created
FROM testimonials
WHERE is_approved = TRUE
ORDER BY date_created DESC;

-- Create a view for pending contact messages (optional)
CREATE VIEW pending_messages AS
SELECT id, name, email, subject, message, date_created
FROM contact_messages
WHERE status = 'pending'
ORDER BY date_created DESC;

-- Add some sample testimonials (optional)
INSERT INTO testimonials (name, email, message, is_approved) VALUES
('John Doe', 'john@example.com', 'Carl is an excellent developer with great problem-solving skills. His attention to detail and ability to learn quickly makes him a valuable team member.', TRUE),
('Jane Smith', 'jane@example.com', 'I had the pleasure of working with Carl on a web development project. His code quality and dedication to the project were outstanding.', TRUE),
('Bob Johnson', 'bob@example.com', 'Carl demonstrates exceptional technical skills and a strong work ethic. He is always willing to go the extra mile to ensure project success.', TRUE);

-- Add some sample contact messages (optional)
INSERT INTO contact_messages (name, email, subject, message, status) VALUES
('Alice Brown', 'alice@example.com', 'Job Opportunity', 'Hi Carl, I saw your portfolio and would like to discuss a potential job opportunity at our company.', 'pending'),
('Charlie Wilson', 'charlie@example.com', 'Project Collaboration', 'Hello, I have an interesting project idea and would love to collaborate with you.', 'read');

-