const { Router } = require("express");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const router = Router();

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

router.get("/", async (req, res) => {
  const courses = await Course.find()
    .populate("userId", "email name")
    .select("price title img");

  res.render("courses", {
    title: "Courses",
    isCourses: true,
    userId: req.user ? req.user._id.toString() : null,
    courses,
  });
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  const course = await Course.findById(req.params.id);

  if (!isOwner(course, req)) {
    return res.redirect('/courses')
  }

  res.render("course-edit", {
    title: `Edit ${course.title}`,
    isCourses: true,
    course,
  });

});

router.post("/edit", auth, async (req, res) => {
  const { id } = req.body;
  const course = await Course.findById(id);

  if (!isOwner(course, req)) {
    return res.redirect('/courses')
  }

  delete req.body.id; // mongoDB use native variable _id, so we didn't want that our id get into collection

  Object.assign(course, req.body);
  await course.save();

  res.redirect("/courses");
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course?.id) {
    res.render("course", {
      layout: "course",
      title: `Course ${course.title}`,
      course,
    });
  } else {
    res.render("404", { title: "Page not found" });
  }
});

router.post("/remove", auth, async (req, res) => {
  const { id } = req.body;

  try {
    await Course.deleteOne({
      _id: id,
      userId: req.user._id
    });
    res.redirect("/courses");
  } catch (e) {
    console.log("courses: router.post(/remove)", e);
  }
});

module.exports = router;
