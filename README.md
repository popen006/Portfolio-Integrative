# Carl Jay Hermida - IT Student Portfolio Website

A comprehensive, full-stack portfolio website for a 2nd year IT student showcasing web development skills, projects, and professional experience. Features real-time data, interactive forms, and modern API integrations.

## 🚀 Features

### **Core Portfolio Features**
- **Professional Showcase**: Modern, responsive design highlighting skills and projects
- **Dynamic Project Display**: GitHub API integration for automatic project updates
- **Interactive Testimonials**: User-submitted feedback system with admin approval
- **Contact Management**: Professional contact form with database storage
- **Real-Time Time Display**: External World Time API for accurate time display

### **Advanced API Integrations (32 Total APIs)**
- **GitHub API**: Fetches repositories, languages, and project details
- **World Time API**: Real-time accurate time display for Manila timezone
- **Email Service API**: SMTP-based email notifications via Nodemailer
- **MySQL Database APIs**: Complete CRUD operations for all data

### **Transaction & Data Management**
- **Contact Form**: Validates and stores messages in MySQL database
- **Testimonial System**: User submissions with approval workflow
- **Visitor Analytics**: Tracks page views, unique visitors, and user behavior
- **Project Management**: Admin endpoints for content management
- **Skills Database**: Professional skill tracking with proficiency levels

### **Security & Performance**
- **Rate Limiting**: Protects against API abuse (100 requests/15 minutes)
- **CORS Protection**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive form validation and sanitization
- **Security Headers**: Helmet.js for web application security
- **Error Handling**: Graceful fallbacks and error recovery

## 🛠️ Technologies Used

### **Frontend Technologies**
- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Advanced styling with Flexbox, Grid, and animations
- **JavaScript (ES6+)**: Modern JavaScript with async/await, fetch API
- **Font Awesome**: Professional icon library
- **Google Fonts**: Custom typography with Inter and JetBrains Mono
- **Animate.css**: Smooth entrance animations

### **Backend Technologies**
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MySQL**: Relational database management system
- **CORS**: Cross-Origin Resource Sharing middleware
- **Helmet**: Security headers middleware
- **Express Rate Limit**: API rate limiting protection

### **API Integrations (32 Total APIs)**
- **GitHub REST API v3**: Repository and language data fetching
- **World Time API**: Real-time accurate time display
- **SMTP Email API**: Professional email notifications via Nodemailer
- **MySQL Database APIs**: Complete CRUD operations

### **Development & Security Tools**
- **Nodemailer**: Email delivery service integration
- **Express Validator**: Input validation and sanitization
- **bcryptjs**: Password hashing (for future authentication)
- **JWT**: JSON Web Tokens (for future authentication)
- **dotenv**: Environment variable management
- **MySQL2**: Enhanced MySQL driver with promises

## Project Structure

```
portfolio-website/
├── index.html              # Main portfolio page
├── styles.css             # CSS styling
├── script.js              # JavaScript functionality
├── assets/                # Images and media
│   ├── images/
│   │   ├── profile.png    # Profile picture
│   │   └── favicon.ico    # Website favicon
│   └── icons/
├── server/                # Backend server
│   ├── server.js          # Main server file
│   ├── package.json       # Server dependencies
│   ├── package-lock.json  # Lock file
│   └── database/
│       └── schema.sql     # Database schema
├── README.md              # Project documentation
└── task_progress.md       # Development progress tracking
```

## Installation

### Frontend Only
1. Clone the repository
2. Open `index.html` in your browser

### With Backend
1. Clone the repository
2. Navigate to the server directory: `cd server`
3. Install dependencies: `npm install`
4. Set up environment variables (see `.env.example`)
5. Set up MySQL database using `database/schema.sql`
6. Run the server: `npm start`
7. Open `http://localhost:3000` in your browser

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=portfolio_db
DB_PORT=3306

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API Keys
WEATHER_API_KEY=your_openweather_api_key
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## 🔌 API Integrations (32 Total APIs)

### **1. GitHub REST API v3**
- **Purpose**: Fetches public repositories and language data for dynamic project display
- **Endpoints**: 
  - `GET /users/{username}/repos` - Fetch repositories
  - `GET /repos/{owner}/{repo}/languages` - Fetch programming languages
- **Features**:
  - Automatic project categorization (Web/Mobile/Desktop)
  - Language breakdown by bytes used
  - Star count and repository statistics
  - Fallback to mock projects if API fails

### **2. World Time API**
- **Purpose**: Provides accurate real-time display for Manila timezone
- **Endpoint**: `GET https://worldtimeapi.org/api/timezone/Asia/Manila`
- **Features**:
  - Real-time clock updates every second
  - Accurate timezone handling
  - Graceful fallback to local time if API unavailable
  - Professional date and time formatting

### **3. SMTP Email API (Nodemailer)**
- **Purpose**: Sends email notifications for contact form submissions
- **Service**: Gmail SMTP (smtp.gmail.com:587)
- **Features**:
  - Professional email templates
  - Database storage with email backup
  - Error handling and retry mechanisms
  - Optional email delivery (doesn't fail if email fails)

### **4. MySQL Database APIs**
- **Purpose**: Complete data persistence and management
- **Tables**: contact_messages, testimonials, projects, skills, visitors
- **Operations**: Full CRUD (Create, Read, Update, Delete) operations
- **Features**:
  - Connection pooling and optimization
  - Prepared statements for security
  - Transaction support
  - Analytics and visitor tracking

### **5. Security & Middleware APIs**
- **CORS API**: Cross-origin resource sharing with multiple origin support
- **Rate Limiting API**: Protection against API abuse (100 requests/15 minutes)
- **Helmet API**: Security headers for web application protection
- **Express Validator API**: Input validation and sanitization

### **6. Browser APIs**
- **Fetch API**: HTTP requests to backend services
- **LocalStorage API**: Client-side data persistence for testimonials
- **Date API**: Built-in JavaScript date operations (fallback)
- **Performance API**: High-resolution timing (for future enhancements)

## 🔄 Transaction Features

### **1. Contact Form System**
- **Multi-Step Processing**: Form validation → Database storage → Email notification
- **Validation**: Comprehensive JavaScript validation (name, email, subject, message)
- **Database Storage**: All messages saved to MySQL with status tracking (pending/read/replied)
- **Email Integration**: SMTP-based email notifications with professional templates
- **Error Handling**: Graceful fallbacks if email service fails
- **Admin Interface**: API endpoints for managing contact messages

### **2. Testimonial Management System**
- **User Submission**: Public form for collecting testimonials
- **Approval Workflow**: Admin can approve/reject testimonials via API
- **Database Storage**: Testimonials stored with approval status
- **Display Logic**: Only approved testimonials shown to public
- **Local Storage Fallback**: Client-side storage if server unavailable
- **Real-time Updates**: Testimonials load dynamically from database

### **3. Visitor Analytics System**
- **Automatic Tracking**: Records IP, user agent, and page visits
- **Statistics**: Total visitors, unique visitors, page view analytics
- **Database Storage**: Persistent visitor data in MySQL
- **Privacy Compliant**: No personal data collection
- **Admin Dashboard**: Analytics API for monitoring website traffic

### **4. Project Management System**
- **GitHub Integration**: Automatic project fetching and categorization
- **Database Storage**: Project details with technologies and links
- **Admin Endpoints**: Add, update, delete projects via API
- **Fallback System**: Mock projects if GitHub API unavailable
- **Real-time Updates**: Projects update automatically from GitHub

### **5. Skills Management System**
- **Professional Display**: Categorized skills with proficiency levels
- **Database Storage**: Skills stored with categories and levels
- **Admin Interface**: Add and manage skills via API
- **Visual Progress**: Progress bars showing skill proficiency
- **Responsive Design**: Skills display adapts to all screen sizes

## Database Schema

The application uses MySQL with the following tables:

- **contact_messages**: Stores contact form submissions
- **projects**: Stores project information
- **skills**: Stores skill information with proficiency levels
- **testimonials**: Stores user testimonials with approval status
- **visitors**: Tracks visitor analytics

## 🌐 Complete API Reference (32 Total Endpoints)

### **Contact Management APIs (3 endpoints)**
- `POST /api/contact` - Submit contact form with validation
- `GET /api/contact/messages` - Retrieve all contact messages (admin)
- `PUT /api/contact/messages/:id/status` - Update message status (pending/read/replied)

### **Testimonial Management APIs (4 endpoints)**
- `GET /api/testimonials` - Get approved testimonials for public display
- `POST /api/testimonials` - Submit new testimonial (requires approval)
- `GET /api/admin/testimonials` - Get all testimonials for admin review
- `PUT /api/admin/testimonials/:id/status` - Approve/reject testimonials

### **Project Management APIs (2 endpoints)**
- `GET /api/projects` - Retrieve all projects with details
- `POST /api/projects` - Add new project (admin only)

### **Skills Management APIs (2 endpoints)**
- `GET /api/skills` - Get all skills with proficiency levels
- `POST /api/skills` - Add new skill (admin only)

### **Analytics & Monitoring APIs (2 endpoints)**
- `GET /api/analytics` - Get visitor statistics and page views
- `GET /api/health` - Server health check and uptime status

### **Static File Serving (1 endpoint)**
- `GET /*` - Serve static files (HTML, CSS, JS, images)

### **Root Route (1 endpoint)**
- `GET /` - Serve main index.html file

### **External APIs (3 endpoints)**
- `GET https://api.github.com/users/{username}/repos` - GitHub repositories
- `GET https://api.github.com/repos/{owner}/{repo}/languages` - Repository languages
- `GET https://worldtimeapi.org/api/timezone/Asia/Manila` - World time data

### **Database Operations (5 SQL operations)**
- **SELECT**: Read data from all tables
- **INSERT**: Add new records to database
- **UPDATE**: Modify existing records
- **CREATE TABLE**: Database schema operations
- **JOIN**: Complex queries with relationships

### **Security & Middleware APIs (4 endpoints)**
- **CORS**: Cross-origin resource sharing validation
- **Rate Limiting**: Request throttling protection
- **Helmet**: Security headers application
- **Express Validator**: Input validation and sanitization

### **Browser APIs (4 endpoints)**
- **Fetch API**: HTTP requests to backend
- **LocalStorage API**: Client-side data persistence
- **Date API**: Built-in JavaScript date operations
- **Performance API**: High-resolution timing

**Total: 32 APIs providing comprehensive functionality**

## Customization

### Colors and Theme
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    --text-color: #your-color;
}
```

### Content
Update the content in `index.html`:
- Replace placeholder text with your information
- Update project details
- Add your GitHub username

### API Keys
For EmailJS integration:
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email template
3. Update the `script.js` with your service ID, template ID, and public key

For Weather API:
1. Sign up at [OpenWeather](https://openweathermap.org/api)
2. Get your API key
3. Update the `.env` file with your API key

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support and questions:
- Create an issue in this repository
- Contact via the contact form on the website

## Features Overview

### 1. Home Section
- Hero section with introduction
- Professional photo/avatar
- Call-to-action buttons

### 2. About Section
- Personal information for Carl Jay Hermida
- Skills and technologies
- Education background (2nd Year IT Student)

### 3. Skills Section
- Categorized skill display (Frontend, Backend, Tools)
- Progress bars showing proficiency levels
- Professional layout

### 4. Projects Section
- Dynamic project loading from GitHub API
- Project filtering by category
- Project details modal
- Fallback to mock projects if API fails

### 5. Testimonials Section
- User testimonial submission form
- Display of approved testimonials
- Admin moderation system

### 6. Weather Section
- Current weather display for Mercedes, Camarines Norte
- Temperature, description, humidity, and wind information
- API fallback when key not configured

### 7. Contact Section
- Contact form with EmailJS integration
- Form validation
- Success/error feedback
- Contact information: cjbuff06@gmail.com, 0981 741 8533
- Location: Mercedes, Camarines Norte
- Social media links

### 8. Backend Features
- RESTful API endpoints
- MySQL database integration
- Visitor analytics tracking
- Admin endpoints for content management
- Security middleware (Helmet, CORS, rate limiting)
- Form validation and sanitization

## Development Notes

This portfolio website demonstrates:
- Modern web development practices
- API integration techniques
- Database design and management
- Form handling and validation
- Responsive design principles
- Security best practices
- Professional code organization

The project is designed to be easily customizable and extensible, making it suitable for IT students to showcase their skills and projects.