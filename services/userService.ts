import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { User } from "firebase/auth";
import { UserProfile } from "../types/userProfile";

/**
 * Create a new user profile document in Firestore
 */
export const createUserProfile = async (user: User): Promise<UserProfile> => {
  const userDocRef = doc(db, "users", user.uid);

  // Check if the user document already exists
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // Create a new user profile
    const newUserProfile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      profileImageURL: user.photoURL || "",
      phoneNumber: user.phoneNumber || "",
      fullName: user.displayName || "",
      following: 0,
      createdAt: new Date(),
    };

    // Set the document (create)
    await setDoc(userDocRef, newUserProfile);
    return newUserProfile;
  }

  // Return existing profile
  return userDoc.data() as UserProfile;
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }

    // If the profile doesn't exist but user is authenticated, create it
    if (auth.currentUser && auth.currentUser.uid === userId) {
      return await createUserProfile(auth.currentUser);
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);

    // Check if the user document exists
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: new Date(),
      });
    } else {
      // Create new document if it doesn't exist
      if (auth.currentUser && auth.currentUser.uid === userId) {
        await createUserProfile(auth.currentUser);

        // Apply updates if there are any beyond the default profile
        if (Object.keys(profileData).length > 0) {
          await updateDoc(userDocRef, {
            ...profileData,
            updatedAt: new Date(),
          });
        }
      }
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Update profile image for a user (stores base64 image in Firestore)
 */
export const updateProfileImage = async (
  userId: string,
  base64Image: string
): Promise<void> => {
  try {
    await updateUserProfile(userId, {
      profileImageURL: base64Image,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error;
  }
};

/**
 * Delete user profile from Firestore
 */
export const deleteUserProfile = async (userId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
};