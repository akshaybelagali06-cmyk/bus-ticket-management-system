const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { search, status, pass_type } = req.query;
    let query = `
      SELECT bp.*, s.name as student_name, s.department,
             r.source, r.destination, r.fare
      FROM buspass bp
      JOIN student s ON bp.student_id = s.student_id
      JOIN route r ON bp.route_id = r.route_id
    `;
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(s.name LIKE ? OR bp.pass_id LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      conditions.push('bp.status = ?');
      params.push(status);
    }
    if (pass_type) {
      conditions.push('bp.pass_type = ?');
      params.push(pass_type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY bp.pass_id DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get passes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT bp.*, s.name as student_name, s.department, s.year, s.phone,
              r.source, r.destination, r.fare
       FROM buspass bp
       JOIN student s ON bp.student_id = s.student_id
       JOIN route r ON bp.route_id = r.route_id
       WHERE bp.pass_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Bus pass not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get pass error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { pass_type, student_id, route_id, issue_date, expiry_date } = req.body;
    if (!pass_type || !student_id || !route_id || !issue_date || !expiry_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO buspass (pass_type, student_id, route_id, issue_date, expiry_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [pass_type, student_id, route_id, issue_date, expiry_date, 'Active']
    );

    const [newPass] = await pool.query(
      `SELECT bp.*, s.name as student_name, s.department,
              r.source, r.destination, r.fare
       FROM buspass bp
       JOIN student s ON bp.student_id = s.student_id
       JOIN route r ON bp.route_id = r.route_id
       WHERE bp.pass_id = ?`,
      [result.insertId]
    );
    res.status(201).json(newPass[0]);
  } catch (error) {
    console.error('Create pass error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { status } = req.body;
    const [existing] = await pool.query('SELECT * FROM buspass WHERE pass_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Bus pass not found' });
    }
    await pool.query('UPDATE buspass SET status = ? WHERE pass_id = ?', [status, req.params.id]);
    const [updated] = await pool.query(
      `SELECT bp.*, s.name as student_name, s.department,
              r.source, r.destination, r.fare
       FROM buspass bp
       JOIN student s ON bp.student_id = s.student_id
       JOIN route r ON bp.route_id = r.route_id
       WHERE bp.pass_id = ?`,
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (error) {
    console.error('Update pass error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM buspass WHERE pass_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Bus pass not found' });
    }
    await pool.query('DELETE FROM buspass WHERE pass_id = ?', [req.params.id]);
    res.json({ message: 'Bus pass deleted successfully' });
  } catch (error) {
    console.error('Delete pass error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

