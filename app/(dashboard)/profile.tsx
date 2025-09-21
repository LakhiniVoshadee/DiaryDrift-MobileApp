import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
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
                setUploading(true);
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
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}
    >
      {/* Gradient Background */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#E8D5FF",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "linear-gradient(to bottom, #E8D5FF, #D4A4EB)",
        }}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          marginBottom: 40,
        }}
      >
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(245, 231, 255, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#6B46C1",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text style={{ color: "#6B46C1", fontSize: 20, fontWeight: "600" }}>
            ←
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: "#6B46C1",
              letterSpacing: 1,
              textShadowColor: "rgba(0, 0, 0, 0.1)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            Profile
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Profile Section */}
      <View
        style={{
          alignItems: "center",
          marginBottom: 40,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity onPress={pickImage} disabled={uploading}>
          <View style={{ position: "relative" }}>
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: "#F5E7FF",
                padding: 6,
                shadowColor: "#6B46C1",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 12,
              }}
            >
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 64,
                  borderWidth: 2,
                  borderColor: "#D4A4EB",
                }}
              />
            </View>

            {uploading && (
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  right: 6,
                  bottom: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(107, 70, 193, 0.6)",
                  borderRadius: 64,
                }}
              >
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}

            <View
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#6B46C1",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <Text style={{ fontSize: 18, color: "#F5E7FF" }}>📷</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 32,
            fontWeight: "800",
            color: "#6B46C1",
            marginTop: 24,
            marginBottom: 12,
            textShadowColor: "rgba(0, 0, 0, 0.1)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {userProfile?.fullName || currentUser?.displayName || "Not set"}
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(245, 231, 255, 0.7)",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 24,
            shadowColor: "#6B46C1",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 6 }}>✏️</Text>
          <Text style={{ color: "#6B46C1", fontSize: 16, fontWeight: "700" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(245, 231, 255, 0.5)",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 18,
            marginTop: 10,
            shadowColor: "#6B46C1",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: 14, marginRight: 6 }}>👥</Text>
          <Text style={{ color: "#8B5CF6", fontSize: 16, fontWeight: "600" }}>
            {userProfile?.following || 0} Following
          </Text>
        </View>
      </View>

      {/* Profile Details Card */}
      <View
        style={{
          marginHorizontal: 20,
          backgroundColor: "#FFFFFF",
          borderRadius: 28,
          padding: 28,
          shadowColor: "#6B46C1",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.2,
          shadowRadius: 24,
          elevation: 10,
          marginBottom: 30,
          borderWidth: 3,
          borderColor: "#D4A4EB",
          borderStyle: "solid",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: "#6B46C1",
              textShadowColor: "rgba(0, 0, 0, 0.1)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            About
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#F5E7FF",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 14,
              shadowColor: "#6B46C1",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text style={{ color: "#6B46C1", fontSize: 14, fontWeight: "700" }}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Full Name
          </Text>
          <Text
            style={{
              color: "#6B46C1",
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            {userProfile?.fullName || currentUser?.displayName || "Not set"}
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Email
          </Text>
          <Text
            style={{
              color: "#6B46C1",
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            {userProfile?.email || currentUser?.email || "Not set"}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ paddingHorizontal: 20, gap: 14 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            paddingVertical: 18,
            paddingHorizontal: 22,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            shadowColor: "#6B46C1",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 6,
            borderWidth: 3,
            borderColor: "#D4A4EB",
            borderStyle: "solid",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#E8D5FF",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 14,
              }}
            >
              <Text style={{ fontSize: 18 }}>🔑</Text>
            </View>
            <Text
              style={{
                color: "#374151",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              Change Password
            </Text>
          </View>
          <Text style={{ color: "#6B46C1", fontSize: 20, fontWeight: "700" }}>
            →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            paddingVertical: 18,
            paddingHorizontal: 22,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            shadowColor: "#6B46C1",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 6,
            borderWidth: 3,
            borderColor: "#D4A4EB",
            borderStyle: "solid",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#FED7D7",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 14,
              }}
            >
              <Text style={{ fontSize: 18 }}>↗️</Text>
            </View>
            <Text
              style={{
                color: "#374151",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              Logout
            </Text>
          </View>
          <Text style={{ color: "#6B46C1", fontSize: 20, fontWeight: "700" }}>
            →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            paddingVertical: 18,
            paddingHorizontal: 22,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#F87171",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 6,
            borderWidth: 3,
            borderColor: "#D4A4EB",
            borderStyle: "solid",
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#FEE2E2",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 14,
            }}
          >
            <Text style={{ fontSize: 18 }}>🗑️</Text>
          </View>
          <Text
            style={{
              color: "#EF4444",
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Elements */}
      <View
        style={{
          position: "absolute",
          top: 100,
          left: -40,
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: "rgba(212, 164, 235, 0.4)",
          transform: [{ rotate: "-10deg" }],
          shadowColor: "#6B46C1",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 6,
        }}
      />

      <View
        style={{
          position: "absolute",
          top: 220,
          right: -50,
          width: 110,
          height: 110,
          borderRadius: 55,
          backgroundColor: "rgba(248, 187, 208, 0.5)",
          transform: [{ rotate: "15deg" }],
          shadowColor: "#6B46C1",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 6,
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 140,
          left: -30,
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: "rgba(245, 231, 255, 0.6)",
          transform: [{ rotate: "-5deg" }],
          shadowColor: "#6B46C1",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 6,
        }}
      />
    </ScrollView>
  );
};

export default Profile;
