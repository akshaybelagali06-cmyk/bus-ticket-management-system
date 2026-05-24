const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/stats', ctrl.getDashboardStats);

module.exports = router;

