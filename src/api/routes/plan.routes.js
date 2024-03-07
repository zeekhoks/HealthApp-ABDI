const express = require("express");
const {validatePlan, validateLinkedPlanServices} = require("./../middleware/validators");
const planController = require("../controllers/plan.controller");

const plansRouter = express.Router();
plansRouter.get("/plans", planController.getPlans);
plansRouter.get("/:id", planController.getPlan);
plansRouter.post("/", validatePlan, planController.createPlan);
plansRouter.delete('/:id', planController.deletePlan);
plansRouter.put('/:id', validatePlan ,planController.updatePlanById);
plansRouter.patch('/:id', validateLinkedPlanServices, planController.addLinkedPlanServices);

module.exports = {
  plansRouter : plansRouter,
};
