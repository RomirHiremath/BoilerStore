import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "687051f95e7cf7b0574dd06a", 
  requiresAuth: true // Ensure authentication is required for all operations
});
