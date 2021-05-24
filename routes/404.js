const {Router} = require('express');

const router = Router();

router.get(
    '/404',
    function(req, res, next){

    next();
});

router.use(function(req, res, next){
    res.status(404);

    res.format({
        html: function () {
            res.render('404', { url: req.url })
        },
        json: function () {
            res.json({ error: 'Not found' })
        },
        default: function () {
            res.type('txt').send('Not found')
        }
    })
});

module.exports = router;