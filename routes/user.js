const express = require('express');
const router = express.Router();

 router.get("/register", (req, res) => { 
   res.render("register", { title: "Register" });
 });

 router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send('All fields are required.');
    }

    await User.create({ name, email, password });
    res.redirect('/');
  } catch (error) {
    console.error('Error registering new user:', error);
    res.status(500).send('Error registering new user.');
  }
});

module.exports = router;