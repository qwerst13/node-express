const { Router } = require("express");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, (req, res) => {
  res.render("add", {
    title: "Courses",
    isAdd: true,
  });
});

router.post("/", auth, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user._id,
  });

  try {
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log("routes/add", e);
  }
});

module.exports = router;
