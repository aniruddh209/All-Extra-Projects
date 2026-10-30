import ApiError from '../utils/ApiError.js';

/**
 * Validation middleware factory.
 * Takes a Zod schema and returns Express middleware that validates
 * the request body against it.
 *
 * Usage in routes:
 *   import { signupSchema } from '../validators/auth.validator.js';
 *   router.post('/signup', validate(signupSchema), authController.signup);
 *
 * If validation fails, throws a 400 ApiError with field-level error details.
 * If validation passes, replaces req.body with the parsed (cleaned) data.
 */
const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    throw new ApiError(400, 'Validation failed', errors);
  }

  // Replace req.body with parsed data (strips unknown fields, applies transforms)
  req.body = result.data;
  next();
};

export default validate;
