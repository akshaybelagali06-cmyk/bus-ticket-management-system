const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {

    const { search, department, year } = req.query;

    let query = 'SELECT * FROM student';

    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(name LIKE ? OR phone LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (department) {
      conditions.push('department = ?');
      params.push(department);
    }

    if (year) {
      conditions.push('year = ?');
      params.push(year);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query(query, params);

    res.json(rows);

  } catch (error) {

    console.error('Get students error:', error);

    res.status(500).json({
      message: 'Server error'
    });

  }
};

exports.getById = async (req, res) => {

  try {

    const [rows] = await pool.query(

      'SELECT * FROM student WHERE student_id = ?',

      [req.params.id]

    );

    if (rows.length === 0) {

      return res.status(404).json({
        message: 'Student not found'
      });

    }

    res.json(rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

exports.create = async (req, res) => {

  try {

    const { name, department, year, phone } = req.body;

    if (!name || !department || !year || !phone) {

      return res.status(400).json({
        message: 'All fields are required'
      });

    }

    const [result] = await pool.query(

      `INSERT INTO student
      (name, department, year, phone)
      VALUES (?, ?, ?, ?)`,

      [name, department, year, phone]

    );

    const [newStudent] = await pool.query(

      'SELECT * FROM student WHERE student_id = ?',

      [result.insertId]

    );

    res.status(201).json(newStudent[0]);

  } catch (error) {

    console.error('Create student error:', error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

exports.update = async (req, res) => {

  try {

    const { name, department, year, phone } = req.body;

    const [existing] = await pool.query(

      'SELECT * FROM student WHERE student_id = ?',

      [req.params.id]

    );

    if (existing.length === 0) {

      return res.status(404).json({
        message: 'Student not found'
      });

    }

    await pool.query(

      `UPDATE student
       SET name = ?,
           department = ?,
           year = ?,
           phone = ?
       WHERE student_id = ?`,

      [name, department, year, phone, req.params.id]

    );

    const [updated] = await pool.query(

      'SELECT * FROM student WHERE student_id = ?',

      [req.params.id]

    );

    res.json(updated[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};

exports.remove = async (req, res) => {

  try {

    const [existing] = await pool.query(

      'SELECT * FROM student WHERE student_id = ?',

      [req.params.id]

    );

    if (existing.length === 0) {

      return res.status(404).json({
        message: 'Student not found'
      });

    }

    await pool.query(

      'DELETE FROM student WHERE student_id = ?',

      [req.params.id]

    );

    res.json({
      message: 'Student deleted successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });

  }

};