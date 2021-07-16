const { Router } = require("express");
const Order = require("../models/order");
const auth = require("../middleware/auth ");
const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      "user.userId": req.user._id,
    }).populate("user.userId");

    res.render("orders", {
      isOrder: true,
      title: "Orders",
      orders: orders.map((item) => ({
        ...item._doc,
        price: item.courses.reduce(
          (acc, curr) => acc + curr.count * curr.course.price,
          0
        ),
      })),
    });
  } catch (e) {
    console.log("routes/orders:get", e);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.courseId").execPopulate();

    const courses = user.cart.items.map((item) => ({
      count: item.count,
      course: { ...item.courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (e) {
    console.log("routes/orders:post", e);
  }
});

module.exports = router;
