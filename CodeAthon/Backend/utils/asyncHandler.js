/**
 * Wraps an async Express route handler to catch rejected promises
 * and forward them to the global error middleware.
 *
 * Without this, every async controller would need try/catch.
 *
 * Usage:
 *   router.get('/parties', asyncHandler(async (req, res) => {
 *     const parties = await Party.find();
 *     res.json(parties);
 *   }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
