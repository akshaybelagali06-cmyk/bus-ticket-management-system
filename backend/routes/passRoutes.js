const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/passController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id/status', ctrl.update);
router.put('/:id/renew', ctrl.renew);
router.delete('/:id', ctrl.remove);
router.post('/update-expired', ctrl.updateExpired);

module.exports = router;
