const {body} = require('express-validator');
const User = require('../models/user');

function customPasswordConfirmValidator(value, req) {
    if (value !== req.body.password) {
        throw new Error('Passwords are not same')
    }
    return true;
}

exports.signupValidators = [
    body(
        'email',
        'Email is incorrect'
    ).isEmail()
    .custom(async (value, {req}) => {
        try {
            const user = await User.findOne({email: value});

            if (user) {
                return Promise.reject('This email already existed');
            }
        } catch (e) {
            console.log('utils/validators:email', e);
        }
    }),
    body(
        'password',
        'Minimum password length need to be at least a value of 6'
    ).isLength({min: 6})
    .isAlphanumeric(),
    body(
        'confirm',
        'Passwords are not same!'
    ).custom((value, {req}) => customPasswordConfirmValidator(value, req)),
    body(
        'name',
        'Minimum name length need to be at least a value of 3'
    ).isLength({min: 3})
];
