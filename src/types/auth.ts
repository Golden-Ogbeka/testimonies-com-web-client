export type AuthKind = 'individual' | 'organization';

export type User = {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  coverImage?: string;
  accountType: AuthKind;
  profileVisibility: 'public' | 'private' | 'secret';
  verified?: boolean;
  followerCount?: number;
  followingCount?: number;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type OtpPayload = {
  email: string;
  verificationCode: string;
};
