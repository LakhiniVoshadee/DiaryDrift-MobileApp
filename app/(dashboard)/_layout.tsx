import { useAuth } from "@/context/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";

const DashBoardLayout = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#8B7CF6", // Modern purple
          tabBarInactiveTintColor: "#9CA3AF", // Soft gray
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: "#8B7CF6",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            height: 85,
            paddingTop: 8,
            paddingBottom: 25,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginBottom: -3,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? "#8B7CF6" : "transparent",
                  borderRadius: 12,
                  padding: focused ? 8 : 0,
                  width: focused ? 40 : 24,
                  height: focused ? 40 : 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign
                  name="home"
                  size={20}
                  color={focused ? "#FFFFFF" : color}
                />
              </View>
            ),
          }}
        />
        
        <Tabs.Screen
          name="journals"
          options={{
            title: "Journals",
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? "#8B7CF6" : "transparent",
                  borderRadius: 12,
                  padding: focused ? 8 : 0,
                  width: focused ? 40 : 24,
                  height: focused ? 40 : 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather
                  name="edit-3"
                  size={20}
                  color={focused ? "#FFFFFF" : color}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? "#8B7CF6" : "transparent",
                  borderRadius: 12,
                  padding: focused ? 8 : 0,
                  width: focused ? 40 : 24,
                  height: focused ? 40 : 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather
                  name="settings"
                  size={20}
                  color={focused ? "#FFFFFF" : color}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? "#8B7CF6" : "transparent",
                  borderRadius: 12,
                  padding: focused ? 8 : 0,
                  width: focused ? 40 : 24,
                  height: focused ? 40 : 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign
                  name="user"
                  size={20}
                  color={focused ? "#FFFFFF" : color}
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default DashBoardLayout;