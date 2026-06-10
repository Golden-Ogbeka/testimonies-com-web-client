export type AuthKind = 'individual' | 'organization';

export type User = {
  _id: string;
  email: string;
  username?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  coverPicture?: string;
  kind?: AuthKind;
  verified?: boolean;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type OtpPayload = {
  email: string;
  verificationCode: string;
};
