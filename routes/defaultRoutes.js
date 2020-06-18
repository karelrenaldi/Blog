const express = require("express");
const {
  index,
  loginGet,
  loginPost,
} = require("../controllers/defaultController");

const router = express.Router();

router.route("/").get(index);
router.route("/login").get(loginGet).post(loginPost);

module.exports = router;
