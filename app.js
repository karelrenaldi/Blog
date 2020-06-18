const express = require("express");
const mongoose = require("mongoose");
const hbs = require("express-handlebars");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const app = express();
const port = 3000 || process.env.PORT;

/* Configure express using middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* Databases */
const db = process.env.DATABASE;
(async () => {
  await mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log("Database connection successful");
})().catch(() => console.log("DB connection failed"));

/* Set up view engine to use handlebars */
app.engine("handlebars", hbs({ defaultLayout: "default" }));
app.set("view engine", "handlebars");

/* Routes */
const defaultRoutes = require("./routes/defaultRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
