const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/stats', ctrl.getDashboardStats);
router.get('/reports', ctrl.getReports);

module.exports = router;
