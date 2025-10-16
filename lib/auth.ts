import * as bcrypt from 'bcryptjs';

export const validateAdminPassword = async (password: string): Promise<boolean> => {
  const hashedPassword = process.env.NEXT_PUBLIC_ADMIN_HASH;
  
  if (!hashedPassword) {
    console.error('Admin hash not found in environment variables');
    return false;
  }

  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error validating password:', error);
    return false;
  }
};

// Types for authentication
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}