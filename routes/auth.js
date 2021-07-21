const { Router } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const router = Router();
const signupEmail = require('../emails/signup');
const resetEmail = require('../emails/reset');

const api_key = process.env.SENDGRID_API_KEY;
const transport = nodemailer.createTransport(sendgrid({
  auth: {api_key}
}));

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
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

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
    const { email, password, repeat, name } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('signupError', 'This e-mail already taken');
      res.redirect('/auth/login#signup');
    } else {
      const hashPassrord = await bcrypt.hash(password, 10)
      const user = new User({ email, name, password: hashPassrord, cart: { items: [] } });
      await user.save();
      
      await transport.sendMail(signupEmail(email));
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.log('routes/auth:post-signup', e);
  }
});

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Password reset',
    error: req.flash('error')
  });
});

router.post('/reset', (req, res) => {
  const { email } = req.body;
  
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (e) {
        req.flash('error', 'Something went wrong, please try again later...')
        return res.redirect('/auth/reset');
      }

      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await transport.sendMail(resetEmail(email, token));
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'This email is not registered in system');
        res.redirect('/auth/reset');
      }
    });
  } catch (e) {
    console.log('routes/auth:post-reset', e);
  }
});

router.get('/password/:token', async (req, res) => {
const { token } = req.params;

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: {$gt: Date.now()}
    });

    if (!user) {
      return res.redirect('/auth/login');
    } else {
      res.render('auth/password', {
        title: 'Password reset',
        error: req.flash('error'),
        userId: user._id.toString(),
        token
      });
    }
  

  } catch (e) {
    console.log('routes/auth:get-password', e)
  }
});

router.post('/password', (req, res) => {

});

module.exports = router;