const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [students] = await pool.query('SELECT COUNT(*) as count FROM student');
    const [routes] = await pool.query('SELECT COUNT(*) as count FROM route');
    const [drivers] = await pool.query('SELECT COUNT(*) as count FROM driver');
    const [activePasses] = await pool.query("SELECT COUNT(*) as count FROM buspass WHERE status = 'Active'");
    const [expiredPasses] = await pool.query("SELECT COUNT(*) as count FROM buspass WHERE status = 'Expired'");

    res.json({
      stats: {
        totalStudents: students[0].count,
        totalRoutes: routes[0].count,
        totalDrivers: drivers[0].count,
        activePasses: activePasses[0].count,
        expiredPasses: expiredPasses[0].count,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

