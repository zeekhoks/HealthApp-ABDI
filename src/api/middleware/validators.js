const planSchema = require("../../schemas/plan.schema.json");
const validate = require("jsonschema").validate;

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

module.exports = {
  validatePlan: validatePlan,
};
