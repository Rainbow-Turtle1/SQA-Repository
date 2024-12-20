import { Router } from 'express';
const router = Router();
// import { User } from '../models/user.js';

router.get('/register', (req, res) => { 
  res.render("register", { title: "Register" });
});


export default router;
