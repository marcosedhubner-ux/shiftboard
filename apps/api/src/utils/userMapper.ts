export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  tenantId: string;
}

export function toPublicUser(user: {
  id: string;
  fullName: string;
  email: string;
  role: string;
  tenantId: string;
}): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
  };
}
