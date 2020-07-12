const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

const port = 8080 || process.env.PORT;

dotenv.config({ path: "./config/config.env" });

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
