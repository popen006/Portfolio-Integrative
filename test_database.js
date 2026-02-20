// Test script to verify database connections and API endpoints
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'your_mysql_username', // Replace with your MySQL username
    password: 'your_mysql_password', // Replace with your MySQL password
    database: 'integ',
    port: 3306
};

async function testDatabase() {
    let connection;
    
    try {
        console.log('🔍 Testing database connection...');
        
        // Test database connection
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL database successfully!');
        
        // Test testimonials table
        console.log('\n📋 Testing testimonials table...');
        const [testimonialRows] = await connection.execute(
            'SELECT id, name, email, message, date_created, is_approved FROM testimonials ORDER BY date_created DESC LIMIT 5'
        );
        console.log(`✅ Testimonials table found with ${testimonialRows.length} records`);
        if (testimonialRows.length > 0) {
            console.log('Sample testimonial:', testimonialRows[0]);
        }
        
        // Test contact_messages table
        console.log('\n📧 Testing contact_messages table...');
        const [contactRows] = await connection.execute(
            'SELECT id, name, email, subject, message, date_created, status FROM contact_messages ORDER BY date_created DESC LIMIT 5'
        );
        console.log(`✅ Contact messages table found with ${contactRows.length} records`);
        if (contactRows.length > 0) {
            console.log('Sample contact message:', contactRows[0]);
        }
        
        // Test table structure
        console.log('\n🏗️  Testing table structures...');
        
        const [testimonialFields] = await connection.execute(
            'DESCRIBE testimonials'
        );
        console.log('✅ Testimonials table structure:');
        testimonialFields.forEach(field => {
            console.log(`   - ${field.Field} (${field.Type}) ${field.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${field.Key || ''}`);
        });
        
        const [contactFields] = await connection.execute(
            'DESCRIBE contact_messages'
        );
        console.log('✅ Contact messages table structure:');
        contactFields.forEach(field => {
            console.log(`   - ${field.Field} (${field.Type}) ${field.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${field.Key || ''}`);
        });
        
        console.log('\n🎉 All database tests passed successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Update server/.env with your actual MySQL credentials');
        console.log('2. Start the server: cd server && npm start');
        console.log('3. Test API endpoints:');
        console.log('   - GET /api/testimonials (fetch approved testimonials)');
        console.log('   - POST /api/testimonials (submit new testimonial)');
        console.log('   - GET /api/contact/messages (fetch contact messages)');
        console.log('   - POST /api/contact (submit contact form)');
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n🔧 Fix: Update your MySQL username and password in the test script and server/.env file');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('\n🔧 Fix: Create the "integ" database in MySQL');
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
            console.log('\n🔧 Fix: Run the server to create the tables automatically');
        }
        
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the test
testDatabase();