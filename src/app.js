require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const  healthzRouter  = require('./api/routes/healthz.routes')
const { plansRouter } = require("./api/routes/plan.routes");

app.use("/v1/healthz", healthzRouter);
app.use("/v1/plan", plansRouter);
MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((error) => [console.log("Error connecting to database", error)]);

module.exports = app;
