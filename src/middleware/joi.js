import JOI from "joi";

const SHORT_STR = JOI.string().allow(null, "");
const SHORT_STR_REQ = JOI.string().required();

const LONG_STR = JOI.string().allow(null, "");
const LONG_STR_REQ = JOI.string().max(5000).required();

const NUM = JOI.number().required();
const NUM_ALLOW = JOI.number().allow(null);

const EMAIL = JOI.string().email({ minDomainSegments: 2 }).allow(null, "");
const EMAIL_REQ = JOI.string().email({ minDomainSegments: 2 }).required();

const DATE_REQ = JOI.date();
const ARR_REQ = JOI.array().items(JOI.string()).min(1).required();

// common joi validator
const validator = (schema, req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    console.log(error);
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

// // new category validator
// export const newCategoryValidator = (req, res, next) => {
//   const schema = JOI.object({
//     title: SHORT_STR_REQ,
//     slug: SHORT_STR_REQ,
//   });

//   return validator(schema, req, res, next);
// };

// new product validator
export const newProductValidator = (req, res, next) => {
  const schema = JOI.object({
    title: SHORT_STR_REQ,
    sku: SHORT_STR_REQ,
    price: NUM,
    quantity: NUM,
    category: SHORT_STR_REQ,
    salesPrice: NUM_ALLOW,
    salesStart: DATE_REQ,
    salesEnd: DATE_REQ,
    description: SHORT_STR_REQ,
    thumbnail: SHORT_STR_REQ,
    images: ARR_REQ,
  });

  return validator(schema, req, res, next);
};
