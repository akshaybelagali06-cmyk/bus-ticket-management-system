const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT rn.*, bp.pass_type, bp.student_id, s.name as student_name,
             bp.route_id, rt.source, rt.destination
      FROM renewal rn
      JOIN buspass bp ON rn.pass_id = bp.pass_id
      JOIN student s ON bp.student_id = s.student_id
      JOIN route rt ON bp.route_id = rt.route_id
      ORDER BY rn.renewal_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get renewals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const [total] = await pool.query('SELECT COALESCE(SUM(amount), 0) as total_revenue FROM renewal');
    const [monthly] = await pool.query(`
      SELECT DATE_FORMAT(renewal_date, '%Y-%m') as month,
             SUM(amount) as revenue, COUNT(*) as count
      FROM renewal GROUP BY DATE_FORMAT(renewal_date, '%Y-%m')
      ORDER BY month DESC LIMIT 12
    `);
    res.json({ total_revenue: total[0].total_revenue, monthly_revenue: monthly });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
