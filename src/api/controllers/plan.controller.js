const planService = require("../services/plan.service");
const etag = require("etag");

const getPlan = async (req, res) => {
  const key = req.params.id;

  try {
    const data = await planService.getPlan(key);

    if (data) {
      const generatedEtag = etag(JSON.stringify(data));
      const receivedEtag = req.headers["if-none-match"];
      if (generatedEtag !== receivedEtag) {
        res.setHeader("etag", generatedEtag);
        res.status(200).json(data);
      } else {
        res.status(304).send();
      }
    } else {
      res.status(404).json({ errorMessage: "Plan not found" });
    }
  } catch (error) {
    res.status(503).json({ errorMessage: "Service currently unavailable" });
  }
};

const getPlans = async(req, res) => {
  try{
    const data = await planService.getAllPlans();
    res.status(200).json(data);
  } catch(error) {
    res.status(503).json({ errorMessage: "Service currently unavailable" });
  }
}

const createPlan = async (req, res) => {
  try {
    const isPlanExists = await planService.getPlan(req.body.objectId);
    if (isPlanExists) {
      res.status(400).json({ errorMessage: "Plan already exists" });
      return;
    }
    console.log("In Save Plan Service");
    const data = await planService.savePlan(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(503).json({ errorMessage: "Service currently unavailable" });
  }
};

const deletePlan = async (req, res) => {
  const key = req.params.id;

  try {
    const plan = await planService.getPlan(key);
    const generatedEtag = etag(JSON.stringify(plan));
    const receivedEtag = req.headers["if-match"];
    if (plan) {
      if(generatedEtag === receivedEtag){
        const data = await planService.deletePlan(key);
        res.status(204).send();
      }else {
        res.status(409).json({errorMessage : "Conflict - latest data not available"});
      }
      
    } else {
      res.status(404).json({ errorMessage: "Plan not found" });
    }
  } catch (error) {
    console.error(error);
    res.staus(503).json({ errorMessage: "Service currently available" });
  }
};

module.exports = {
  getPlan: getPlan,
  getPlans: getPlans,
  createPlan: createPlan,
  deletePlan: deletePlan,
};
