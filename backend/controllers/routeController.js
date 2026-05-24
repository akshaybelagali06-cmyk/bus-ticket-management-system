const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT r.*, d.name as driver_name, COALESCE(r.bus_no, d.bus_no) as bus_no
      FROM route r
      LEFT JOIN driver d ON r.driver_id = d.driver_id
    `;
    const params = [];

    if (search) {
      query += ' WHERE r.source LIKE ? OR r.destination LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, d.name as driver_name, COALESCE(r.bus_no, d.bus_no) as bus_no
       FROM route r LEFT JOIN driver d ON r.driver_id = d.driver_id
       WHERE r.route_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { driver_id, source, destination, fare, bus_no } = req.body;
    if (!source || !destination || !fare) {
      return res.status(400).json({ message: 'Source, destination, and fare are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO route (driver_id, source, destination, fare, bus_no) VALUES (?, ?, ?, ?, ?)',
      [driver_id || null, source, destination, fare, bus_no || null]
    );
    const [newRoute] = await pool.query(
      `SELECT r.*, d.name as driver_name, COALESCE(r.bus_no, d.bus_no) as bus_no
       FROM route r LEFT JOIN driver d ON r.driver_id = d.driver_id
       WHERE r.route_id = ?`,
      [result.insertId]
    );
    res.status(201).json(newRoute[0]);
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { driver_id, source, destination, fare, bus_no } = req.body;
    const [existing] = await pool.query('SELECT * FROM route WHERE route_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Route not found' });
    }
    await pool.query(
      'UPDATE route SET driver_id = ?, source = ?, destination = ?, fare = ?, bus_no = ? WHERE route_id = ?',
      [driver_id || null, source, destination, fare, bus_no || null, req.params.id]
    );
    const [updated] = await pool.query(
      `SELECT r.*, d.name as driver_name, COALESCE(r.bus_no, d.bus_no) as bus_no
       FROM route r LEFT JOIN driver d ON r.driver_id = d.driver_id
       WHERE r.route_id = ?`,
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM route WHERE route_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Route not found' });
    }
    await pool.query('DELETE FROM route WHERE route_id = ?', [req.params.id]);
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
