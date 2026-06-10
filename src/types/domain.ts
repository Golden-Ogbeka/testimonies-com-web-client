export type SignUpPayload = {
  email?: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  businessName?: string;
  businessEmail?: string;
  businessPhoneNumber?: string;
  businessAddress?: string;
};

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  address?: string;
  phone?: string;
  username?: string;
};

export type UpdateTestimonyPayload = {
  title?: string;
  description?: string;
  tags?: string[];
  isBroadcast?: boolean;
  broadcastOrganizationId?: string;
  isSecret?: boolean;
};

export type SubscriptionPlan = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price?: number;
  interval?: string;
};

export type SubscriptionHistoryItem = {
  _id?: string;
  status?: string;
  amount?: number;
  createdAt?: string;
};

export type SubscribePayload = {
  planId: string;
};

export type CancelSubscriptionPayload = {
  reason?: string;
};

export type PromotionItem = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  status?: string;
};

export type CreatePromotionPayload = {
  title: string;
  description?: string;
};

export type TeamMember = {
  _id: string;
  email?: string;
  fullName?: string;
  username?: string;
  status?: string;
};

export type TeamRole = {
  _id: string;
  name?: string;
};

export type AddTeamMemberPayload = {
  email: string;
};

export type UpdateTeamMemberPayload = {
  email?: string;
  fullName?: string;
};

export type CreateRolePayload = {
  name: string;
  permissions?: string[];
};

export type UpdateRolePayload = {
  name?: string;
  permissions?: string[];
};

export type ActivityLog = {
  _id: string;
  action?: string;
  createdAt?: string;
  member?: TeamMember;
};

export type UpdatePromotionPayload = {
  title?: string;
  description?: string;
};

export type PromotionStats = {
  views?: number;
  clicks?: number;
  conversions?: number;
};

export type PaySubscriptionPayload = {
  planId: string;
  paymentMethod?: string;
};

export type VerifyPaymentPayload = {
  reference: string;
};

export type UpdateEmailPayload = {
  email: string;
};

export type UpdateUsernamePayload = {
  username: string;
};

export type UpdatePhonePayload = {
  phoneNumber: string;
};

export type UpdatePasswordPayload = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type DeleteProfilePayload = {
  password: string;
};

export type UpdateOrgProfilePayload = {
  businessName?: string;
  businessAddress?: string;
  businessWebsite?: string;
  businessBio?: string;
};

export type UpdateVisibilityPayload = {
  profileVisibility: 'public' | 'private' | 'secret';
};

export type FollowRequest = {
  _id: string;
  requester?: import('./auth').User;
  createdAt?: string;
};

export type BlockedUser = {
  _id: string;
  blockedUser?: import('./auth').User;
  createdAt?: string;
};
