import JOI from "joi";

const SHORT_STR = JOI.string().allow(null, "");
const SHORT_STR_REQ = JOI.string().required();

const LONG_STR = JOI.string().allow(null, "");
const LONG_STR_REQ = JOI.string().max(5000).required();

const NUM = JOI.number();
const NUM_ALLOW = JOI.number().allow(null);

const EMAIL = JOI.string().email({ minDomainSegments: 2 }).allow(null, "");
const EMAIL_REQ = JOI.string().email({ minDomainSegments: 2 }).required();

// common joi validator
const validator = (schema, req, res, next) => {
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
  const schema = JOI.object({
    firstName: SHORT_STR_REQ,
    lastName: SHORT_STR_REQ,
    phone: NUM_ALLOW,
    email: EMAIL_REQ,
    password: SHORT_STR_REQ,
  });

  return validator(schema, req, res, next);
};
