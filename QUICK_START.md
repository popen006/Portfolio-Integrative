# 🚀 Quick Start Guide - Portfolio Website with MySQL

## **✅ What's Been Done**

Your portfolio website is now fully configured to fetch data from your MySQL `integ` database! Here's what I've set up:

### **🔧 Backend Server (Node.js + Express)**
- ✅ Database connection to your `integ` database
- ✅ API endpoints for testimonials and contact messages
- ✅ Proper field mapping to match your database schema
- ✅ Security middleware (CORS, rate limiting, helmet)
- ✅ Email functionality for contact forms
- ✅ Error handling and logging

### **📊 Database Schema**
- ✅ Testimonials table with `is_approved` boolean field
- ✅ Contact messages table with `date_created` timestamp
- ✅ Projects and skills tables for future expansion
- ✅ Visitors tracking table

## **📋 Step-by-Step Setup**

### **Step 1: Create Database and Tables**
Run this SQL script in your MySQL client:
```sql
-- Copy and paste the content from create_database.sql
-- Or run: mysql -u root -p < create_database.sql
```

### **Step 2: Update Database Password**
Edit `server/.env` and set your MySQL password:
```env
DB_PASSWORD=your_actual_mysql_password_here
```

### **Step 3: Install Dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install:server
```

### **Step 4: Test Database Connection**
```bash
node test_connection.js
```

### **Step 5: Start the Server**
```bash
cd server && npm start
```

## **🌐 Server Information**

- **Server URL**: http://localhost:3000
- **API Base URL**: http://localhost:3000/api
- **Database**: integ (MySQL)

## **📊 Available API Endpoints**

### **Testimonials**
- `GET /api/testimonials` - Fetch approved testimonials
- `POST /api/testimonials` - Submit new testimonial
- `GET /api/admin/testimonials` - Admin: View all testimonials
- `PUT /api/admin/testimonials/:id/status` - Admin: Approve/reject testimonials

### **Contact Messages**
- `GET /api/contact/messages` - Admin: View all contact messages
- `POST /api/contact` - Submit contact form
- `PUT /api/contact/messages/:id/status` - Admin: Update message status

### **Other Endpoints**
- `GET /api/projects` - Fetch projects
- `GET /api/skills` - Fetch skills
- `GET /api/analytics` - View analytics
- `GET /api/health` - Health check

## **📝 Testing the API**

### **Test Testimonials**
```bash
# Fetch testimonials
curl http://localhost:3000/api/testimonials

# Submit testimonial
curl -X POST http://localhost:3000/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","message":"Great developer!"}'
```

### **Test Contact Form**
```bash
# Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com","subject":"Job Offer","message":"We want to hire you!"}'
```

## **🔧 Troubleshooting**

### **Database Connection Issues**
```bash
# Test connection
node test_connection.js

# Common fixes:
# 1. Update DB_PASSWORD in server/.env
# 2. Make sure MySQL server is running
# 3. Create the 'integ' database if it doesn't exist
```

### **Server Won't Start**
```bash
# Check for errors
cd server && npm start

# Common fixes:
# 1. Install dependencies: npm install && npm run install:server
# 2. Check .env file for correct credentials
# 3. Make sure port 3000 is not in use
```

### **API Endpoints Not Working**
```bash
# Test health check
curl http://localhost:3000/api/health

# Check if tables exist
mysql -u root -p -e "USE integ; SHOW TABLES;"
```

## **📁 Project Structure**

```
integ/
├── server/
│   ├── server.js          # Main server file
│   ├── .env              # Environment variables
│   └── package.json      # Server dependencies
├── index.html            # Main HTML file
├── script.js             # Frontend JavaScript
├── styles.css            # CSS styles
├── package.json          # Root package.json
├── create_database.sql   # Database creation script
├── test_connection.js    # Database test script
└── QUICK_START.md        # This file
```

## **✨ Next Steps**

1. **Connect Frontend** - Update your frontend JavaScript to call the API endpoints
2. **Add Email Configuration** - Set up email credentials in `.env` for contact form notifications
3. **Add Sample Data** - Use the sample data in `create_database.sql` for testing
4. **Deploy** - Consider deploying to platforms like Heroku, Railway, or Vercel

## **🎉 You're All Set!**

Your portfolio website is now ready to:
- ✅ Fetch testimonials from your MySQL database
- ✅ Handle contact form submissions
- ✅ Provide admin endpoints for managing data
- ✅ Work with your existing frontend

The server will automatically create tables if they don't exist, so you can start using it immediately after setting up the database!