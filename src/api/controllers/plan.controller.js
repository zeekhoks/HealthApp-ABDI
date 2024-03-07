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
            res.status(404).json({errorMessage: "Plan not found"});
        }
    } catch (error) {
        res.status(503).json({errorMessage: "Service currently unavailable"});
    }
};

const getPlans = async (req, res) => {
    try {
        const data = await planService.getAllPlans();
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({errorMessage: "Plan not found"});
        }
    } catch (error) {
        res.status(503).json({errorMessage: "Service currently unavailable"});
    }
};

const createPlan = async (req, res) => {
    try {
        const isPlanExists = await planService.getPlan(req.body.objectId);
        if (isPlanExists) {
            res.status(400).json({errorMessage: "Plan already exists"});
            return;
        }
        const data = await planService.savePlan(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(503).json({errorMessage: "Service currently unavailable"});
    }
};

const deletePlan = async (req, res) => {
    const key = req.params.id;

    try {
        const plan = await planService.getPlan(key);
        const generatedEtag = etag(JSON.stringify(plan));
        const receivedEtag = req.headers["if-match"];
        if (plan) {
            if (generatedEtag === receivedEtag) {
                const data = await planService.deletePlan(key);
                res.status(204).send();
            } else {
                res
                    .status(409)
                    .json({errorMessage: "Conflict - latest data not available"});
            }
        } else {
            res.status(404).json({errorMessage: "Plan not found"});
        }
    } catch (error) {
        console.error(error);
        res.staus(503).json({errorMessage: "Service currently available"});
    }
};

const updatePlanById = async (req, res) => {
    const key = req.params.id;
    try {
        const existingPlan = await planService.getPlan(key)
        if (existingPlan) {
            const receivedEtag = req.headers['if-match'];
            const newEtag = etag(JSON.stringify(existingPlan))

            if (receivedEtag !== newEtag) {
                res.status(412).json({error: "Resource state might have changed or ETag might be wrong"})
                return
            }
            const data = await planService.updatePlan(req.body);
            res.setHeader('ETag', etag(JSON.stringify(req.body)));
            res.status(200).json(data);
        } else {
            res.status(404).json({"errorMessage": "Plan not found"})
        }
    } catch (error) {
        console.log(error)
        res.status(503).json({"errorMessage": "Service currently unavailable"})
    }
}

const addLinkedPlanServices = async (req, res) => {
    const key = req.params.id;
    try{
        const existingPlan = await planService.getPlan(key);
        if(existingPlan){
            const receivedEtag = req.headers['if-match'];
            const newEtag = etag(JSON.stringify(existingPlan))
            if (receivedEtag !== newEtag) {
                res.status(412).json({ error: "Resource state might have changed or ETag might be wrong" })
            }
            const linkedPlanServicesMap = {};

            for (const linkedPlanService of existingPlan.linkedPlanServices) {
                linkedPlanServicesMap[linkedPlanService.objectId] = linkedPlanService
            }

            for (const linkedPlanService of req.body.linkedPlanServices) {
                if (!linkedPlanServicesMap[linkedPlanService.objectId]) {
                    existingPlan.linkedPlanServices.push(linkedPlanService);
                }
            }

            const updatedPlan = await planService.updatePlan(existingPlan)
            res.setHeader('ETag', etag(JSON.stringify(updatedPlan)))
            res.status(200).json(updatedPlan)
        } else {
            res.status(404).json({ "errorMessage": "Plan not found" })
        }
    }catch(error){
        console.log(error)
        res.status(503).json({"errorMessage": "Service currently unavailable"})
    }
}

module.exports = {
    getPlan: getPlan,
    getPlans: getPlans,
    createPlan: createPlan,
    deletePlan: deletePlan,
    updatePlanById: updatePlanById,
    addLinkedPlanServices: addLinkedPlanServices,
};
