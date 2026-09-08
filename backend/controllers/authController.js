const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const snapshot = await db.collection('admin_users').where('username', '==', username).get();
    if (snapshot.empty) return res.status(401).json({ message: 'Invalid credentials' });

    const userDoc = snapshot.docs[0];
    const user = { ...userDoc.data(), id: userDoc.id };
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      token,
      user: { id: user.id, username: user.username, full_name: user.full_name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const doc = await db.collection('admin_users').doc(req.user.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'User not found' });
    const user = doc.data();
    res.json({ id: doc.id, username: user.username, full_name: user.full_name, email: user.email });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
