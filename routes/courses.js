const {Router} = require('express');
const Course = require('../models/course');
const fs = require('fs');
const path = require('path');

const router = Router();

router.get('/', async (req, res) => {
   const courses = await Course.getAll();

    res.render('courses', {
        title: 'Add course',
        isCourses: true,
        courses
    });
});

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    else {
        const course = await Course.getById(req.params.id);

        res.render('course-edit', {
            isCourses: true,
            course
        });
    }
});

router.post('/edit', async (req, res) => {
    await Course.edit(req.body);

    res.redirect('/courses');
});

router.get('/:id', async (req, res) => {
    const course = await Course.getById(req.params.id);

    if (course?.id) {
        res.render('course', {
            layout: 'course',
            title: `Course ${course.title}`,
            course
        });
    }
    else {
        res.render('404', {title: 'Page not found'});
    }
});

module.exports = router;