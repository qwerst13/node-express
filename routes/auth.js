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
  try {
    const {email, password} = req.body;

    const candidate = await User.findOne({email});

    if (candidate) {
      const isCorrect = password === candidate.password;

      if (isCorrect) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) throw err;
          else res.redirect('/');
        });

      } else {
        res.redirect('/auth/login#login');
      }
    } else {
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log('routes/auth:post-login', e);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const {email, password, repeat, name} = req.body;

    const candidate = await User.findOne({email});

    if (candidate) {
      res.redirect('/auth/login#login');
    } else {
      const user = new User({ email, name, password, cart: {items: []} });
      await user.save();
      res.redirect('/auth/login#login')
    }
  } catch(e) {
    console.log('routes/auth:post-signup', e);
  }
});

module.exports = router;