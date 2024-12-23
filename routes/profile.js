import { Router } from 'express';
const router = Router();
// import { User } from '../models/user.js'

router.get('/profile', (req, res) => {
	res.render('profile', { title: 'Profile'})
})

export default router