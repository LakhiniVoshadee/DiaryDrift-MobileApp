import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../../firebase";
import { signOut, deleteUser } from "firebase/auth";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../../services/userService";
import { UserProfile } from "../../types/userProfile";

const Profile = () => {
  const [profileImage, setProfileImage] = useState<string>(
    "https://via.placeholder.com/100"
  );
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user);
      fetchUserProfileImage(user.uid);
    }
  }, []);

  // Fetch existing profile image if available
  const fetchUserProfileImage = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        if (profile.profileImageURL) {
          setProfileImage(profile.profileImageURL);
        }
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
      Alert.alert(
        "Error",
        "Failed to load profile data. Please try again later."
      );
    }
  };

  // Request permission and open image picker
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need camera roll permission to upload photos."
        );
        return;
      }

      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // This is fine, no need to change
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Lower quality to reduce size for base64
        base64: true, // Request base64 data
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        if (selectedAsset.base64) {
          uploadImageAsBase64(selectedAsset.base64);
        }
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while selecting the image.");
      console.error(error);
    }
  };

  // Upload base64 image to Firestore
  const uploadImageAsBase64 = async (base64Image: string) => {
    if (!currentUser) {
      Alert.alert(
        "Error",
        "You need to be logged in to upload a profile picture."
      );
      return;
    }

    setUploading(true);

    try {
      // Create the complete base64 data URL
      const base64ImageData = `data:image/jpeg;base64,${base64Image}`;

      // Save the URL to Firestore using userService
      await updateUserProfile(currentUser.uid, {
        profileImageURL: base64ImageData,
        updatedAt: new Date(),
      });

      setProfileImage(base64ImageData);
      setUploading(false);
      Alert.alert("Success", "Profile picture updated successfully!");

      // Refresh user profile data
      fetchUserProfileImage(currentUser.uid);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
      setUploading(false);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "You have been logged out successfully.");
      // Navigate to login screen if needed
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (currentUser) {
              try {
                setUploading(true); // Use as general loading indicator
                // First delete the profile from Firestore
                await deleteUserProfile(currentUser.uid);
                // Then delete the user authentication
                await deleteUser(currentUser);
                Alert.alert(
                  "Account Deleted",
                  "Your account has been successfully deleted."
                );
                // Navigate to login/signup screen if needed
              } catch (error) {
                console.error("Error deleting account:", error);
                Alert.alert(
                  "Error",
                  "Failed to delete account. You may need to reauthenticate before deleting."
                );
              } finally {
                setUploading(false);
              }
            }
          },
        },
      ]
    );
  };

  return (
    <View
      className="flex-1 w-full"
      style={{ backgroundColor: "#D1C4E9", paddingTop: 40 }}
    >
      {/* Header with Back Button and Title */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity>
          <Text style={{ color: "#B39DDB", fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text
          className="text-center flex-1 text-2xl"
          style={{ color: "#B39DDB", fontFamily: "sans-serif-medium" }}
        >
          User Profile
        </Text>
      </View>

      {/* Profile Section */}
      <View className="items-center mt-6">
        <TouchableOpacity onPress={pickImage} disabled={uploading}>
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: profileImage }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: "#B39DDB",
              }}
            />
            {uploading && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: 50,
                }}
              >
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            )}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#B39DDB",
                borderRadius: 15,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>📷</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text
          className="text-xl mt-2"
          style={{ color: "#B39DDB", fontFamily: "sans-serif-medium" }}
        >
          {userProfile?.fullName || "User"}
        </Text>
        <TouchableOpacity>
          <Text style={{ color: "#8E8E93", fontSize: 14 }}>
            ✏️ Edit Profile
          </Text>
        </TouchableOpacity>
        <Text className="text-base mt-1" style={{ color: "#8E8E93" }}>
          (📊 {userProfile?.following || 0} Following)
        </Text>
      </View>

      {/* About Section */}
      <View className="mt-6 px-4">
        <View className="flex-row justify-between items-center">
          <Text
            className="text-lg"
            style={{ color: "#B39DDB", fontFamily: "sans-serif-medium" }}
          >
            About
          </Text>
          <TouchableOpacity>
            <Text style={{ color: "#8E8E93", fontSize: 14 }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ color: "#8E8E93" }}>Full Name:</Text>
          <Text style={{ color: "#B39DDB" }}>
            {userProfile?.fullName || "Not set"}
          </Text>
          <Text style={{ color: "#8E8E93", marginTop: 5 }}>Email:</Text>
          <Text style={{ color: "#B39DDB" }}>
            {userProfile?.email || currentUser?.email || "Not set"}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ color: "#8E8E93" }}>Change Password</Text>
          <Text style={{ color: "#B39DDB" }}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ color: "#8E8E93" }}>Logout</Text>
          <Text style={{ color: "#B39DDB" }}>↻</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ color: "#F44336" }}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Decorative pink shape (simulated with a View) */}
      <View
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          width: 100,
          height: 100,
          backgroundColor: "#F8BBD0",
          borderRadius: 50,
          opacity: 0.7,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          width: 120,
          height: 120,
          backgroundColor: "#F8BBD0",
          borderRadius: 60,
          opacity: 0.7,
        }}
      />
    </View>
  );
};

export default Profile;