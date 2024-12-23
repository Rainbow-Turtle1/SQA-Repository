import { Router } from 'express';
const router = Router();
import { User } from '../models/user.js'

router.get('/profile', (req, res) => {
	res.render('register', { title: 'Register'})
})