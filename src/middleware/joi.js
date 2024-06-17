import JOI from "joi";

const STR_REQ = JOI.string().required();
const STR_ALLOW = JOI.string().allow(null, "");
const NUM_ALLOW = JOI.number().allow(null);

const EMAIL = JOI.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
});

// global joi validator
const joiValidator = (schema, req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

// new admin validator
export const newUserValidator = (req, res, next) => {
  console.log(req.body);
  const schema = JOI.object({
    firstName: STR_REQ,
    lastName: STR_REQ,
    phone: NUM_ALLOW,
    email: EMAIL,
    password: STR_REQ,
  });

  return joiValidator(schema, req, res, next);
};
