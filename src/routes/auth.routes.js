const express = require("express");   // fix spelling too
const authController = require('../controllers/authcontrollers');

const router = express.Router();

router.post('/register', authController.userRegiserController);
router.post('/login', authController.userLoginController)

module.exports = router;   // ✅ FIXED