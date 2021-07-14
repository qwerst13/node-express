const {Router} = require('express');
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
  req.session.isAuthenticated = true;
  res.redirect('/');
});

router.post('/signup', async (req, res) => {

});

module.exports = router;