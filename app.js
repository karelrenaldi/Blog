const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const fileUpload = require("express-fileupload");
const { selectOption, preview, getDate, getMonth } = require("./config/helper");

const app = express();

/* File Upload Middleware*/
app.use(fileUpload());

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
app.engine(
  "handlebars",
  hbs({
    defaultLayout: "default",
    helpers: {
      select: selectOption,
      preview: preview,
      getDate: getDate,
      getMonth: getMonth,
    },
  })
);
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

/* Global Variables */
app.use(globalVariables);

/* Method Override Middleware */
app.use(methodOverride("newMethod"));

/* Routes */
app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);
// 404 routes
app.use((req, res) => {
  req.app.locals.layout = "404";
  res.status(404).render(`${__dirname}/views/404`);
});

module.exports = app;
