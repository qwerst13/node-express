const {Router} = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Log in',
    isLogin: true,
    loginError: req.flash('loginError'),
    signupError: req.flash('signupError')
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
      const isCorrect = await bcrypt.compare(password, candidate.password);

      if (isCorrect) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) throw err;
          else res.redirect('/');
        });

      } else {
        req.flash('loginError', 'Wrong password')
        res.redirect('/auth/login#login');
      }
    } else {
      req.flash('loginError', 'User with this email does not exist');
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
      req.flash('signupError', 'This e-mail already taken')
      res.redirect('/auth/login#signup');
    } else {
      const hashPassrord = await bcrypt.hash(password, 10)
      const user = new User({ email, name, password: hashPassrord, cart: {items: []} });
      await user.save();
      res.redirect('/auth/login#login')
    }
  } catch(e) {
    console.log('routes/auth:post-signup', e);
  }
});

module.exports = router;