import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const Journal = () => {
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
        <Image
          source={{ uri: "https://via.placeholder.com/100" }} // Replace with actual profile image URL
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text
          className="text-xl mt-2"
          style={{ color: "#B39DDB", fontFamily: "sans-serif-medium" }}
        >
          Sarah Jr. Marshal
        </Text>
        <TouchableOpacity>
          <Text style={{ color: "#8E8E93", fontSize: 14 }}>
            ✏️ Edit Profile
          </Text>
        </TouchableOpacity>
        <Text className="text-base mt-1" style={{ color: "#8E8E93" }}>
          (📊 250 Following)
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
          <Text style={{ color: "#B39DDB" }}>Sarah Jr. Marshal</Text>
          <Text style={{ color: "#8E8E93", marginTop: 5 }}>Email:</Text>
          <Text style={{ color: "#B39DDB" }}>Sarah_marshal@gmail.com</Text>
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

export default Journal;
