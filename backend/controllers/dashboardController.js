const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    // Auto-update expired passes first
    await pool.query("UPDATE buspass SET status = 'Expired' WHERE expiry_date < CURDATE() AND status = 'Active'");

    const [students] = await pool.query('SELECT COUNT(*) as count FROM student');
    const [routes] = await pool.query('SELECT COUNT(*) as count FROM route');
    const [drivers] = await pool.query('SELECT COUNT(*) as count FROM driver');
    const [active] = await pool.query("SELECT COUNT(*) as count FROM buspass WHERE status = 'Active'");
    const [expired] = await pool.query("SELECT COUNT(*) as count FROM buspass WHERE status = 'Expired'");
    const [renewals] = await pool.query('SELECT COUNT(*) as count FROM renewal');

    // Monthly renewals chart data
    const [monthlyRenewals] = await pool.query(`
      SELECT DATE_FORMAT(renewal_date, '%b') as month, COUNT(*) as count
      FROM renewal GROUP BY DATE_FORMAT(renewal_date, '%Y-%m'), DATE_FORMAT(renewal_date, '%b')
      ORDER BY MIN(renewal_date) DESC LIMIT 6
    `);

    // Route usage
    const [routeUsage] = await pool.query(`
      SELECT CONCAT(r.source, ' → ', r.destination) as route, COUNT(bp.pass_id) as count
      FROM route r LEFT JOIN buspass bp ON r.route_id = bp.route_id
      GROUP BY r.route_id, r.source, r.destination ORDER BY count DESC LIMIT 5
    `);

    // Pass status distribution
    const [passStatus] = await pool.query(`
      SELECT status, COUNT(*) as count FROM buspass GROUP BY status
    `);

    res.json({
      stats: {
        totalStudents: students[0].count,
        totalRoutes: routes[0].count,
        totalDrivers: drivers[0].count,
        activePasses: active[0].count,
        expiredPasses: expired[0].count,
        totalRenewals: renewals[0].count,
      },
      charts: {
        monthlyRenewals: monthlyRenewals.reverse(),
        routeUsage,
        passStatus,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const [activeUsers] = await pool.query(`
      SELECT COUNT(DISTINCT student_id) as count FROM buspass WHERE status = 'Active'
    `);
    const [expiredPasses] = await pool.query(`
      SELECT bp.pass_id, s.name as student_name, s.department, bp.expiry_date,
             CONCAT(r.source, ' → ', r.destination) as route
      FROM buspass bp JOIN student s ON bp.student_id = s.student_id
      JOIN route r ON bp.route_id = r.route_id WHERE bp.status = 'Expired'
      ORDER BY bp.expiry_date DESC LIMIT 20
    `);
    const [routeStats] = await pool.query(`
      SELECT r.route_id, CONCAT(r.source, ' → ', r.destination) as route, r.fare,
             COUNT(bp.pass_id) as total_passes,
             SUM(CASE WHEN bp.status = 'Active' THEN 1 ELSE 0 END) as active_passes
      FROM route r LEFT JOIN buspass bp ON r.route_id = bp.route_id
      GROUP BY r.route_id, r.source, r.destination, r.fare ORDER BY total_passes DESC
    `);

    res.json({
      activeUsers: activeUsers[0].count,
      expiredPasses,
      routeStats,
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
