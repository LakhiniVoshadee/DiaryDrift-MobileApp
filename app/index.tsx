import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#A084DC] pt-12 pb-4 px-5">
        <Text className="text-white text-2xl font-bold">DiaryDrift</Text>
        <Text className="text-white text-sm mt-1">Your journaling journey</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Featured Section */}
        <View className="mb-6">
          <Text className="text-gray-800 text-lg font-semibold mb-3">
            Today's Highlight
          </Text>
          <View className="bg-[#E6CFFF] rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="h-16 w-16 bg-[#D3BDF3] rounded-full items-center justify-center">
                <Text className="text-[#A084DC] text-2xl">📔</Text>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-800 font-bold text-lg">
                  Daily Entry
                </Text>
                <Text className="text-gray-600 mt-1">
                  Write your thoughts for today
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Access */}
        <Text className="text-gray-800 text-lg font-semibold mb-3">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {["New Entry", "Memories", "Mood", "Stats"].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-xl p-4 mb-4 shadow-sm w-[48%] items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 1,
              }}
              onPress={() =>
                item === "New Entry"
                  ? router.push("/new-entry")
                  : item === "Memories"
                  ? router.push("/memories")
                  : item === "Mood"
                  ? router.push("/mood")
                  : router.push("/stats")
              }
            >
              <View className="h-12 w-12 bg-[#E6CFFF] rounded-full items-center justify-center mb-2">
                <Text className="text-[#A084DC] text-xl">
                  {item === "New Entry"
                    ? "✍️"
                    : item === "Memories"
                    ? "📅"
                    : item === "Mood"
                    ? "😊"
                    : "📊"}
                </Text>
              </View>
              <Text className="text-gray-800 font-medium">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text className="text-gray-800 text-lg font-semibold mb-3 mt-2">
          Recent Entries
        </Text>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className="bg-white p-4 rounded-lg mb-3 shadow-sm border border-gray-100"
          >
            <View className="flex-row items-center">
              <View className="h-10 w-10 bg-[#E6CFFF] rounded-full items-center justify-center">
                <Text className="text-[#A084DC]">📝</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-medium">
                  Entry {item} - {new Date().toLocaleDateString()}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Started at 07:47 PM
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center bg-white py-3 border-t border-gray-200">
        {["Home", "Explore", "New", "History", "Profile"].map((item, index) => (
          <TouchableOpacity key={index} className="items-center">
            <View className="h-6 w-6 items-center justify-center mb-1">
              <Text>
                {item === "Home"
                  ? "🏠"
                  : item === "Explore"
                  ? "🔍"
                  : item === "New"
                  ? "➕"
                  : item === "History"
                  ? "⏳"
                  : "👤"}
              </Text>
            </View>
            <Text
              className={`text-xs ${
                index === 0 ? "text-[#A084DC] font-medium" : "text-gray-500"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Index;
