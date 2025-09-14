import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { router } from "expo-router";

const Home = () => {
  return (
    <View className="flex-1 bg-gradient-to-b from-[#D3BDF3] to-[#E6CFFF]">
      {/* Background Blobs */}
      <View className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-[#FFC1CC] rounded-full opacity-50 blur-md" />
      <View className="absolute bottom-[-15%] right-[-10%] w-48 h-48 bg-[#FFC1CC] rounded-full opacity-40 blur-md" />

      {/* Header */}
      <View className="bg-[#A084DC] pt-12 pb-4 px-5">
        <Text className="text-white text-2xl font-bold">DiaryDrift</Text>
        <Text className="text-white text-sm mt-1">
          Your journaling sanctuary
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Main Content Card */}
        <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          {/* Today's Entry */}
          <View className="mb-6">
            <Text className="text-gray-800 text-lg font-semibold mb-3">
              Today&apos;s Reflection
            </Text>
            <View className="flex-row items-center">
              <View className="h-16 w-16 bg-[#E6CFFF] rounded-full items-center justify-center">
                <Text className="text-[#A084DC] text-2xl">📖</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-800 font-bold text-lg">
                  New Journal Entry
                </Text>
                <Text className="text-gray-600 mt-1">
                  Capture your thoughts for {new Date().toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("../new-entry")}
                className="bg-[#A084DC] p-2 rounded-full"
              >
                <Text className="text-white text-sm font-medium">✍️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Journal Actions */}
          <Text className="text-gray-800 text-lg font-semibold mb-4">
            Journal Tools
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {["Memories", "Mood", "Insights"].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-xl p-4 mb-4 w-[48%] items-center shadow-md"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                onPress={() =>
                  item === "Memories"
                    ? router.push("../memories")
                    : item === "Mood"
                    ? router.push("../mood")
                    : router.push("../insights")
                }
              >
                <View className="h-12 w-12 bg-[#D3BDF3] rounded-full items-center justify-center mb-2">
                  <Text className="text-[#A084DC] text-xl">
                    {item === "Memories" ? "📅" : item === "Mood" ? "😊" : "📈"}
                  </Text>
                </View>
                <Text className="text-gray-800 font-medium text-center">
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Entries */}
          <Text className="text-gray-800 text-lg font-semibold mb-4 mt-6">
            Recent Entries
          </Text>
          {[1, 2].map((item) => (
            <View
              key={item}
              className="bg-white p-4 rounded-lg mb-4 shadow-md border border-gray-100"
            >
              <View className="flex-row items-center">
                <View className="h-10 w-10 bg-[#E6CFFF] rounded-full items-center justify-center">
                  <Text className="text-[#A084DC]">📝</Text>
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-gray-800 font-medium">
                    Entry {item} - {new Date().toLocaleDateString()}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Written at 09:51 PM
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
    </View>
  );
};

export default Home;
