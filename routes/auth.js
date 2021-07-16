const {Router} = require('express');
const User = require('../models/user');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Log in',
    isLogin: true
  })
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
});

router.post('/login', async (req, res) => {
  const user = await User.findById("60db31e0b92e5722ace4e23e");
  req.session.user = user;
  req.session.isAuthenticated = true;
  req.session.save((err) => {
    if (err) throw err;
    else res.redirect('/');
  })
});

router.post('/signup', async (req, res) => {

});

module.exports = router;