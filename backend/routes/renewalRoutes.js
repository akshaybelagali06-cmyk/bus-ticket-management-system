const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/renewalController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', ctrl.getAll);
router.get('/revenue', ctrl.getRevenue);

module.exports = router;
