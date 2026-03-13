import express from 'express';
import { UserLogin, UserSignup } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/login').post(UserLogin)
router.route('/signup').post(UserSignup)

export default router;