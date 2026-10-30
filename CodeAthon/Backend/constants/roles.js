/**
 * Role constants for the application.
 * Used in User model, middleware, and frontend permission checks.
 * Keep this as the single source of truth for role values.
 */
export const ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
};

/** Array of all valid roles — useful for Mongoose enum validation */
export const ROLE_VALUES = Object.values(ROLES);

export default ROLES;
