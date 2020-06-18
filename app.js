const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
const flash = require("flash");
const session = require("express-session");

const app = express();

/* Global Variables */
const globalVariables = (req, res, next) => {
  res.locals.success_message = req.flash("success-message");
  res.locals.failed_message = req.flash("failed-message");
  next();
};

/* Configure express using middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* Set up view engine to use handlebars */
// Use Middleware to change default layout
app.engine("handlebars", hbs({ defaultLayout: "default" }));
app.set("view engine", "handlebars");
// Morgan middleware
app.use(morgan("dev"));

/* Routes */
const defaultRoutes = require("./routes/defaultRoutes");
const adminRoutes = require("./routes/adminRoutes");

/* Flash and Session */
app.use(
  session({
    secret: "anysecret",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());

app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
