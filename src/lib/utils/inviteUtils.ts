import { InviteDetails, InviteToken } from '../types/invite';
import { AppError } from './error';

export async function validateInviteToken(token: string): Promise<InviteDetails> {
  try {
    // In a real app, this would make an API call to validate the token
    // For demo purposes, we'll decode and validate locally
    const decodedToken = decodeToken(token);
    
    if (!isValidToken(decodedToken)) {
      throw new Error('Invalid or expired invitation token');
    }

    // Mock invitation details
    return {
      token: decodedToken.token,
      email: decodedToken.email,
      managerId: decodedToken.managerId,
      managerName: 'John Doe', // In real app, fetch from API
      companyName: 'ResourceFlow',
      role: decodedToken.role,
      expiresAt: decodedToken.expiresAt,
      status: 'pending',
    };
  } catch (error) {
    throw new AppError(
      'Invalid invitation link. Please contact your team manager.',
      'INVALID_INVITE',
      400
    );
  }
}

function decodeToken(token: string): InviteToken {
  // In a real app, this would properly decode a JWT or similar token
  // For demo, we'll parse a simple base64 encoded string
  try {
    const decoded = JSON.parse(atob(token));
    return decoded;
  } catch {
    throw new Error('Invalid token format');
  }
}

function isValidToken(token: InviteToken): boolean {
  if (!token.email || !token.managerId || !token.role || !token.expiresAt) {
    return false;
  }

  const expirationDate = new Date(token.expiresAt);
  if (expirationDate < new Date()) {
    return false;
  }

  return true;
}