const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM driver';
    const params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR phone LIKE ? OR bus_no LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM driver WHERE driver_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, phone, bus_no } = req.body;
    if (!name || !phone || !bus_no) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO driver (name, phone, bus_no) VALUES (?, ?, ?)',
      [name, phone, bus_no]
    );
    const [newDriver] = await pool.query('SELECT * FROM driver WHERE driver_id = ?', [result.insertId]);
    res.status(201).json(newDriver[0]);
  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, phone, bus_no } = req.body;
    const [existing] = await pool.query('SELECT * FROM driver WHERE driver_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    await pool.query(
      'UPDATE driver SET name = ?, phone = ?, bus_no = ? WHERE driver_id = ?',
      [name, phone, bus_no, req.params.id]
    );
    const [updated] = await pool.query('SELECT * FROM driver WHERE driver_id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM driver WHERE driver_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    await pool.query('DELETE FROM driver WHERE driver_id = ?', [req.params.id]);
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
