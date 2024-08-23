import JOI from "joi";

const SHORT_STR = JOI.string().allow(null, "");
const SHORT_STR_REQ = JOI.string().required();

const NUM = JOI.number().required();
const NUM_ALLOW = JOI.number().allow(null);

const EMAIL = JOI.string().email({ minDomainSegments: 2 }).allow(null, "");
const EMAIL_REQ = JOI.string().email({ minDomainSegments: 2 }).required();

const DATE = JOI.date();

// common joi validator
const validator = (schema, req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    error && console.log("JOI validator error: ", error);
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

// new product validator
export const newProductValidator = (req, res, next) => {
  const schema = JOI.object({
    name: SHORT_STR_REQ,
    sku: SHORT_STR_REQ,
    price: NUM,
    quantity: NUM,
    description: SHORT_STR_REQ,
    categoryId: SHORT_STR_REQ,
    brandId: SHORT_STR_REQ,
    materialId: SHORT_STR_REQ,
    gender: SHORT_STR.valid("men", "women", "unisex").default("unisex"),
    salesPrice: NUM_ALLOW,
    salesStart: DATE,
    salesEnd: DATE,
  });

  return validator(schema, req, res, next);
};

// new review validatior
export const newReviewValidator = (req, res, next) => {
  const schema = JOI.object({
    title: STR_REQ,
    message: STR_REQ,
    ratings: NUM_REQ,
    productId: STR_REQ,
    orderId: STR_REQ,
  });

  return joiValidator(schema, req, res, next);
};
