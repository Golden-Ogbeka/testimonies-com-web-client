export type UserDetails = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  accountType: string;
  profileImage: string;
  profileVisibility: string;
};

export type Testimony = {
  _id: string;
  title: string;
  description: string;
  userId: string;
  likesCount: number;
  viewsCount: number;
  repliesCount: number;
  tags: string[];
  isBroadcast: boolean;
  broadcastApproved: boolean;
  isEdited: boolean;
  mediaURLs: string[];
  userType: string;
  deletedBy: string;
  createdAt: string;
  updatedAt: string;
  isFollowed: boolean;
  userDetails: UserDetails;
  isLiked: boolean;
};

export type Reply = {
  _id: string;
  testimonyId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userDetails: UserDetails;
  likesCount: number;
  isLiked: boolean;
};

export type TestimonyStats = {
  testimoniesCount: number;
  repliesCount: number;
  likesReceivedCount: number;
  viewsReceivedCount: number;
  likesGivenCount: number;
  viewsGivenCount: number;
};

export type BroadcastRequest = {
  _id: string;
  testimony?: Testimony;
  status?: string;
  createdAt?: string;
};
