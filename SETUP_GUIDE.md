# 🚀 Portfolio Website Setup Guide

## **📋 Prerequisites**

- **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
- **MySQL** - [Download MySQL](https://dev.mysql.com/downloads/)
- **A MySQL client** (MySQL Workbench, phpMyAdmin, or command line)

## **🔧 Step 1: Install Dependencies**

### Option A: Install from Root Directory (Recommended)
```bash
# Install dependencies for the entire project
npm install

# Install server dependencies
npm run install:server
```

### Option B: Install from Server Directory
```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Go back to root
cd ..
```

## **⚙️ Step 2: Configure Database**

### 1. Create the Database
```sql
CREATE DATABASE integ;
USE integ;
```

### 2. Create Tables (Optional - Server will create them automatically)
Run the SQL from `mysql_schema.sql` or let the server create them on startup.

### 3. Update Database Credentials
Edit `server/.env` and replace with your actual MySQL credentials:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=integ
```

## **🧪 Step 3: Test Database Connection**

```bash
# Test database connection and tables
npm test
```

This will verify:
- ✅ Database connection
- ✅ Testimonials table exists
- ✅ Contact messages table exists
- ✅ Table structures are correct

## **🚀 Step 4: Start the Server**

### Option A: From Root Directory
```bash
# Start the server
npm start
```

### Option B: From Server Directory
```bash
# Navigate to server directory
cd server

# Start the server
npm start
```

### Option C: Development Mode
```bash
# Start in development mode
npm run dev
```

## **🌐 Server Information**

- **Server URL**: http://localhost:3000
- **API Base URL**: http://localhost:3000/api
- **Database**: integ (MySQL)

## **📊 Available API Endpoints**

### Testimonials
- `GET /api/testimonials` - Fetch approved testimonials
- `POST /api/testimonials` - Submit new testimonial
- `GET /api/admin/testimonials` - Admin: View all testimonials
- `PUT /api/admin/testimonials/:id/status` - Admin: Approve/reject testimonials

### Contact Messages
- `GET /api/contact/messages` - Admin: View all contact messages
- `POST /api/contact` - Submit contact form
- `PUT /api/contact/messages/:id/status` - Admin: Update message status

### Other Endpoints
- `GET /api/projects` - Fetch projects
- `GET /api/skills` - Fetch skills
- `GET /api/analytics` - View analytics
- `GET /api/health` - Health check

## **📝 Testing the API**

### Test Testimonials
```bash
# Fetch testimonials
curl http://localhost:3000/api/testimonials

# Submit testimonial
curl -X POST http://localhost:3000/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","message":"Great developer!"}'
```

### Test Contact Form
```bash
# Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com","subject":"Job Offer","message":"We want to hire you!"}'
```

## **🔧 Troubleshooting**

### Common Issues

**1. Database Connection Error**
```
Error: ER_ACCESS_DENIED_ERROR
```
**Fix**: Update your MySQL username and password in `server/.env`

**2. Database Not Found**
```
Error: ER_BAD_DB_ERROR
```
**Fix**: Create the `integ` database in MySQL

**3. Tables Not Found**
```
Error: ER_NO_SUCH_TABLE
```
**Fix**: Start the server - it will create the tables automatically

**4. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Fix**: Change the PORT in `server/.env` or stop other services using port 3000

### Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check if MySQL is running
mysql --version

# Test database connection
mysql -u your_username -p -e "SHOW DATABASES;"
```

## **📁 Project Structure**

```
integ/
├── server/
│   ├── server.js          # Main server file
│   ├── .env              # Environment variables
│   ├── package.json      # Server dependencies
│   └── database/
│       └── schema.sql    # Database schema
├── index.html            # Main HTML file
├── script.js             # Frontend JavaScript
├── styles.css            # CSS styles
├── package.json          # Root package.json
├── mysql_schema.sql      # Complete database schema
├── test_database.js      # Database test script
└── SETUP_GUIDE.md        # This file
```

## **✨ Next Steps**

1. **Update Database Credentials** in `server/.env`
2. **Start the Server** with `npm start`
3. **Test the API** using the curl commands above
4. **Connect Frontend** to the API endpoints
5. **Add Email Configuration** for contact form notifications

## **📧 Email Configuration (Optional)**

To enable email notifications for contact forms, update these settings in `server/.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
```

**Note**: For Gmail, you'll need to create an App Password instead of using your regular password.

---

🎉 **You're all set!** Your portfolio website is now ready to fetch data from your MySQL `integ` database.