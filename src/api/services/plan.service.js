const Plan = require("../models/plan");

const savePlan = async (planObject) => {
  const plan = new Plan(planObject);

  const res = await plan.save();

  return res;
};

const getPlan = async (objectId) => {
  const plan = await Plan.findOne({
    objectId: objectId,
  });

  return plan;
};

const getAllPlans = async () => {
  const plans = await Plan.find();
  return plans;
}

const deletePlan = async (objectId) => {
  const deletedPlan = await Plan.deleteOne({
    objectId: objectId,
  });

  return deletedPlan;
};

module.exports = { savePlan, getPlan, getAllPlans, deletePlan };
