// Mirrors the `role_id` values stored in Supabase auth `user_metadata`.
// Centralized so role checks aren't scattered as magic numbers across
// middleware, providers, and hooks.
export const ROLE_CUSTOMER = 2;
export const ROLE_BRAND = 4;

export type RoleId = typeof ROLE_CUSTOMER | typeof ROLE_BRAND;
