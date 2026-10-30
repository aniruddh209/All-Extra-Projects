import ApiError from '../utils/ApiError.js';

/**
 * Role-based authorization middleware factory.
 * Restricts route access to specific roles (e.g. 'OWNER', 'ADMIN').
 *
 * Usage:
 *   router.get('/settings', requireAuth, requireRole('OWNER'), handler);
 *   router.post('/items', requireAuth, requireRole('OWNER', 'ADMIN'), handler);
 *
 * @param {...string} allowedRoles - Roles permitted to access the route
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Requires one of: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
}

export default requireRole;
