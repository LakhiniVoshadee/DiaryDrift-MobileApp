export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  profileImageURL?: string;
  profileImageBase64?: string;
  phoneNumber?: string;
  fullName?: string;
  following?: number;
  createdAt?: any;
  updatedAt?: any;
}