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
      style={{ flex: 1, backgroundColor: "#E8D5FF" }}
      contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 40,
      }}>
        <TouchableOpacity style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Text style={{ color: "#6B46C1", fontSize: 20, fontWeight: "600" }}>←</Text>
        </TouchableOpacity>
        
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#6B46C1",
            letterSpacing: 0.5,
          }}>
            Profile
          </Text>
        </View>
        
        <View style={{ width: 40 }} />
      </View>

      {/* Profile Section */}
      <View style={{
        alignItems: "center",
        marginBottom: 40,
        paddingHorizontal: 20,
      }}>
        <TouchableOpacity onPress={pickImage} disabled={uploading}>
          <View style={{ position: "relative" }}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "white",
              padding: 4,
              shadowColor: "#6B46C1",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 10,
            }}>
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 56,
                }}
              />
            </View>
            
            {uploading && (
              <View style={{
                position: "absolute",
                top: 4,
                left: 4,
                right: 4,
                bottom: 4,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(107, 70, 193, 0.7)",
                borderRadius: 56,
              }}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            )}
            
            <View style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#6B46C1",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <Text style={{ fontSize: 16 }}>📷</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={{
          fontSize: 28,
          fontWeight: "700",
          color: "#6B46C1",
          marginTop: 20,
          marginBottom: 8,
        }}>
          {userProfile?.fullName || "User"}
        </Text>

        <TouchableOpacity style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          marginBottom: 12,
        }}>
          <Text style={{ fontSize: 14, marginRight: 4 }}>✏️</Text>
          <Text style={{ color: "#6B46C1", fontSize: 14, fontWeight: "600" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 15,
        }}>
          <Text style={{ fontSize: 12, marginRight: 4 }}>👥</Text>
          <Text style={{ color: "#8B5CF6", fontSize: 14, fontWeight: "500" }}>
            {userProfile?.following || 0} Following
          </Text>
        </View>
      </View>

      {/* Profile Details Card */}
      <View style={{
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#6B46C1",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
        marginBottom: 30,
      }}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#6B46C1",
          }}>
            About
          </Text>
          <TouchableOpacity style={{
            backgroundColor: "#F3F4F6",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}>
            <Text style={{ color: "#6B46C1", fontSize: 12, fontWeight: "600" }}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{
            color: "#9CA3AF",
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}>
            Full Name
          </Text>
          <Text style={{
            color: "#6B46C1",
            fontSize: 16,
            fontWeight: "600",
          }}>
            {userProfile?.fullName || "Not set"}
          </Text>
        </View>

        <View>
          <Text style={{
            color: "#9CA3AF",
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}>
            Email
          </Text>
          <Text style={{
            color: "#6B46C1",
            fontSize: 16,
            fontWeight: "600",
          }}>
            {userProfile?.email || currentUser?.email || "Not set"}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        <TouchableOpacity style={{
          backgroundColor: "white",
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          shadowColor: "#6B46C1",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E8D5FF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}>
              <Text style={{ fontSize: 16 }}>🔑</Text>
            </View>
            <Text style={{
              color: "#374151",
              fontSize: 16,
              fontWeight: "600",
            }}>
              Change Password
            </Text>
          </View>
          <Text style={{ color: "#6B46C1", fontSize: 18, fontWeight: "600" }}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleLogout}
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            shadowColor: "#6B46C1",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#FED7D7",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}>
              <Text style={{ fontSize: 16 }}>↗️</Text>
            </View>
            <Text style={{
              color: "#374151",
              fontSize: 16,
              fontWeight: "600",
            }}>
              Logout
            </Text>
          </View>
          <Text style={{ color: "#6B46C1", fontSize: 18, fontWeight: "600" }}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleDeleteAccount}
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#F87171",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
            borderWidth: 1,
            borderColor: "#FEE2E2",
          }}
        >
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#FEE2E2",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}>
            <Text style={{ fontSize: 16 }}>🗑️</Text>
          </View>
          <Text style={{
            color: "#EF4444",
            fontSize: 16,
            fontWeight: "600",
          }}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Elements */}
      <View style={{
        position: "absolute",
        top: 120,
        left: -30,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(196, 164, 255, 0.3)",
      }} />
      
      <View style={{
        position: "absolute",
        top: 200,
        right: -40,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "rgba(248, 187, 208, 0.4)",
      }} />
      
      <View style={{
        position: "absolute",
        bottom: 150,
        left: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255, 182, 193, 0.5)",
      }} />
    </ScrollView>
  );
};

export default Profile;