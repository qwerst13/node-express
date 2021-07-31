const { body } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.signupValidators = [
  body('email', 'Email is incorrect')
    .isEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });

        if (user) {
          return Promise.reject('This email already existed');
        } else return true;
      } catch (e) {
        console.log('utils/validators:email', e);
      }
    })
    .normalizeEmail(),
  body('password', 'Minimum password length need to be at least a value of 6')
    .isLength({ min: 6 })
    .isAlphanumeric()
    .trim(),
  body('confirm', 'Passwords are not same!')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords are not same');
      }
      return true;
    })
    .trim(),
  body('name', 'Minimum name length need to be at least a value of 3').isLength({ min: 3 }).trim(),
];

exports.loginValidatiors = [
  body('email', 'User with this email not existed')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });

        if (!user) return Promise.reject('User with this email not existed');

        return true;
      } catch (err) {
        console.log('utils/validators:login-email');
      }
    }),
  body('password', 'Wrong password')
    .trim()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: req.body.email });

      const isCorrect = await bcrypt.compare(value, user.password);

      if (!isCorrect) {
        return Promise.reject('Wrong password');
      } else return true;
    }),
];
