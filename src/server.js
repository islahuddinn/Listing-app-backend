const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "src/config.env" });
const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);

const DBURl = process.env.MONGODB;
mongoose
  .connect(DBURl, {})
  .then(() => console.log("DB is connected succefully"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(3000, () => console.log("Server running on port 3000"));
