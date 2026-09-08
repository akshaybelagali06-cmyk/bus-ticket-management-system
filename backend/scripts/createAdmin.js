const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const snapshot = await db.collection('admin_users').where('username', '==', username).get();

  if (!snapshot.empty) {
    console.log('Admin user already exists.');
    return;
  }

  await db.collection('admin_users').add({
    username,
    password: await bcrypt.hash(password, 10),
    full_name: process.env.ADMIN_FULL_NAME || 'System Administrator',
    email: process.env.ADMIN_EMAIL || 'admin@buspass.com',
  });
  console.log('Admin user created successfully.');
}

createAdmin().catch((error) => {
  console.error('Admin creation failed:', error);
  process.exit(1);
});
