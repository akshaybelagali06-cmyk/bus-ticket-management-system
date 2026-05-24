const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  // Create database
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'bus_pass_management'}`);
  await connection.query(`USE ${process.env.DB_NAME || 'bus_pass_management'}`);

  // Drop old plural tables if they exist to avoid confusion
  await connection.query(`DROP TABLE IF EXISTS renewals`);
  await connection.query(`DROP TABLE IF EXISTS bus_passes`);
  await connection.query(`DROP TABLE IF EXISTS routes`);
  await connection.query(`DROP TABLE IF EXISTS drivers`);
  await connection.query(`DROP TABLE IF EXISTS students`);

  // Create admin_users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create student table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS student (
      student_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      department VARCHAR(50),
      year INT,
      phone VARCHAR(15)
    )
  `);

  // Create driver table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS driver (
      driver_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      phone VARCHAR(15),
      bus_no VARCHAR(20)
    )
  `);

  // Create route table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS route (
      route_id INT AUTO_INCREMENT PRIMARY KEY,
      driver_id INT,
      source VARCHAR(100),
      destination VARCHAR(100),
      bus_no VARCHAR(20),
      fare DECIMAL(10,2),
      FOREIGN KEY (driver_id) REFERENCES driver(driver_id) ON DELETE SET NULL
    )
  `);

  // Create buspass table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS buspass (
      pass_id INT AUTO_INCREMENT PRIMARY KEY,
      pass_type VARCHAR(20),
      student_id INT,
      route_id INT,
      issue_date DATE,
      expiry_date DATE,
      status VARCHAR(20),
      FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
      FOREIGN KEY (route_id) REFERENCES route(route_id) ON DELETE CASCADE
    )
  `);

  // Create renewal table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS renewal (
      renewal_id INT AUTO_INCREMENT PRIMARY KEY,
      pass_id INT,
      renewal_date DATE,
      amount DECIMAL(10,2),
      FOREIGN KEY (pass_id) REFERENCES buspass(pass_id) ON DELETE CASCADE
    )
  `);

  // Seed default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await connection.query(`
    INSERT IGNORE INTO admin_users (username, password, full_name, email)
    VALUES ('admin', ?, 'System Administrator', 'admin@buspass.com')
  `, [hashedPassword]);

  console.log('✅ Database initialized successfully with singular tables!');
  await connection.end();
}

initializeDatabase().catch(err => {
  console.error('❌ Database initialization failed:', err.message);
  process.exit(1);
});
