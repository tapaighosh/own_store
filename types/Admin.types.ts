/**
 * TypeScript interfaces for the Admin entity.
 *
 * These are separate from the Mongoose model interfaces (IAdmin)
 * and are used for API responses, form data, and client-side state.
 *
 * Rule: NEVER include `password` in any type that leaves the server.
 */

// ---------------------------------------------------------------------------
// API Response Types
// ---------------------------------------------------------------------------

/**
 * Safe admin object — password is stripped before returning to clients.
 * Use this as the return type of any admin-related API response.
 */
export interface Admin {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// NextAuth Session Extension
// ---------------------------------------------------------------------------

/**
 * The admin data stored in the NextAuth JWT session.
 * Extend NextAuth's built-in Session type using module augmentation.
 */
export interface AdminSession {
  id: string;
  name: string;
  email: string;
}

// ---------------------------------------------------------------------------
// Form Types
// ---------------------------------------------------------------------------

export interface AdminLoginFormData {
  email: string;
  password: string;
}

export interface AdminRegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ---------------------------------------------------------------------------
// API Request/Response Types
// ---------------------------------------------------------------------------

export interface AdminLoginResponse {
  success: boolean;
  message?: string;
}
