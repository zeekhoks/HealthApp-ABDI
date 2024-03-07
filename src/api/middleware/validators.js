const planSchema = require("../../schemas/plan.schema.json");
const linkedPlanServicesSchema = require("../../schemas/linkedPlanServices.schema.json");
const validate = require("jsonschema").validate;
const authService = require("../services/auth.service");

const validatePlan = async (req, res, next) => {
    var result = validate(req.body, planSchema);
    if (result.errors.length > 0) {
        const formattedErrors = result.errors.map((error) => ({
            errorProperty: error.argument,
            errorMessage: error.message,
        }));
        res.status(400).json(formattedErrors);
        return;
    }
    next();
};

const validateLinkedPlanServices = async (req, res, next) => {
    var result = validate(req.body, linkedPlanServicesSchema);
    if (result.errors.length > 0) {
        const formattedErrors = result.errors.map((error) => ({
            errorProperty: error.argument,
            errorMessage: error.message,
        }));
        res.status(400).json(formattedErrors);
        return;
    }
    next();
};

const tokenValidator = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split(' ')[1];
        try {
            const isTokenValid = await authService.validateToken(token);
            if(isTokenValid){
                next()
            }
        } catch (error) {
            console.log(error)
            res.status(401).json({ error: 'Authentication failed' });
        }
    } else {
        res.status(401).json({ error: 'Invalid bearer token' });
    }
}

module.exports = {
    validatePlan: validatePlan,
    validateLinkedPlanServices: validateLinkedPlanServices,
    tokenValidator: tokenValidator
};
