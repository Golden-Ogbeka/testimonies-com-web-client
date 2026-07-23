export type AuthKind = 'user' | 'organization';

export type User = {
  _id: string;
  username: string;
  password?: string;
  active: boolean;
  emailIsVerified: boolean;
  phoneNumberIsVerified: boolean;
  isFlagged: boolean;
  subscriptionType: 'basic' | 'premium';
  kycCompleted: boolean;
  triedLogin: boolean;
  triedPasswordReset: boolean;
  lastLoginAttempt?: string;
  lastSuccessfulLogin?: string;
  triedSignup?: boolean;
  profileVisibility: 'public' | 'private' | 'secret';
  createdAt?: string;
  updatedAt?: string;
  coverImageURL?: string;
  verificationCode?: string;
  ntfToken?: string;

  // User-specific fields
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
  address?: string;
  bio?: string;

  // Organization-specific fields
  businessName?: string;
  businessEmail?: string;
  businessPhoneNumber?: string;
  businessLogoURL?: string;
  businessAddress?: string;
  businessLocationGeographicCoordinates?: [number, number];
  businessWebsite?: string;
  businessBio?: string;

  // Virtual / computed fields
  accountType: AuthKind;
  verified?: boolean;
  isFollowing?: boolean;
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
