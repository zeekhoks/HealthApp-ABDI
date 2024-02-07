const express = require("express");
const {validatePlan} = require("./../middleware/validators");
const planController = require("../controllers/plan.controller");

const plansRouter = express.Router();
plansRouter.get("/:id", planController.getPlan);
plansRouter.post("/", validatePlan, planController.createPlan);
plansRouter.delete('/:id', planController.deletePlan);

module.exports = {
  plansRouter : plansRouter,
};
