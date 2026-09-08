const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [students, drivers, routes, passes, activePasses, expiredPasses] = await Promise.all([
      db.collection('students').count().get(),
      db.collection('drivers').count().get(),
      db.collection('routes').count().get(),
      db.collection('passes').count().get(),
      db.collection('passes').where('status', '==', 'Active').count().get(),
      db.collection('passes').where('status', '==', 'Expired').count().get(),
    ]);
    res.json({
      stats: {
        totalStudents: students.data().count,
        totalRoutes: routes.data().count,
        totalDrivers: drivers.data().count,
        totalPasses: passes.data().count,
        activePasses: activePasses.data().count,
        expiredPasses: expiredPasses.data().count,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
