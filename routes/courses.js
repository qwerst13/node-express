const { Router } = require("express");
const Course = require("../models/course");

const router = Router();

router.get("/", async (req, res) => {
  // populate - expand ObjectId that we get from Course model, there we have ref on User model
  // select - get only arguments that we choose, all other ignored
  const courses = await Course.find()
    .populate("userId", "email name")
    .select("price title img");

  res.render("courses", {
    title: "Add course",
    isCourses: true,
    courses,
  });
});

router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  } else {
    const course = await Course.findById(req.params.id);

    res.render("course-edit", {
      isCourses: true,
      course,
    });
  }
});

router.post("/edit", async (req, res) => {
  const { id } = req.body;
  delete req.body.id; // mongoDB use native variable _id, so we didn't want that our id get into collection

  await Course.findByIdAndUpdate(id, req.body);

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

router.post("/remove", async (req, res) => {
  const { id } = req.body;

  try {
    await Course.findByIdAndDelete(id);
    res.redirect("/courses");
  } catch (e) {
    console.log("courses: router.post(/remove)", e);
  }
});

module.exports = router;
