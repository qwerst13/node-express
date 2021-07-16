const { Router } = require("express");
const auth = require("../middleware/auth ");
const Course = require("../models/course");
const User = require("../models/user");
const router = Router();

function mapCartItem(cart) {
  return cart.items.map((item) => ({
    ...item.courseId._doc,
    id: item.courseId.id,
    count: item.count,
  }));
}

function calculateTotalPrice(courses) {
  return courses.reduce((acc, curr) => acc + curr.count * curr.price, 0);
}

router.get("/", auth, async (req, res) => {
  const user = await req.user.populate("cart.items.courseId").execPopulate();

  const courses = mapCartItem(user.cart);

  res.render("cart", {
    title: "Cart",
    isCart: true,
    courses: courses,
    totalPrice: calculateTotalPrice(courses),
  });
});

router.post("/add", auth, async (req, res) => {
  const course = await Course.findById(req.body.id);

  await req.user.addToCart(course);

  res.redirect("/cart");
});

router.delete("/remove/:id", auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);

  const user = await req.user.populate("cart.items.courseId").execPopulate();
  const courses = mapCartItem(user.cart);
  const cart = {
    courses,
    totalPrice: calculateTotalPrice(courses),
  };

  res.status(200).json(cart);
});

module.exports = router;
