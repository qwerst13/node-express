const {Router} = require('express');
const Cart = require('../models/cart');
const Course = require('../models/course');
const router = Router();

router.post('/add', async (req, res) => {
    const course = await Course.getById(req.body.id);

    await Cart.add(course);

    res.redirect('/cart');
});

router.get('/', async (req, res) => {
    const cart = await Cart.getCart();

    res.render('cart', {
        title: 'Cart',
        isCart: true,
        courses: cart.courses,
        totalPrice: cart.totalPrice
    });
});

module.exports = router;