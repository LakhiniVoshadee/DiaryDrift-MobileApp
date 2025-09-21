import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { router } from "expo-router";
import { getAllJournalData } from "@/services/journalService";
import { Journal } from "@/types/journal";
import { Ionicons } from "@expo/vector-icons";

// Helper function to get mood emoji and color
const getMoodEmoji = (mood: string | undefined) => {
  switch (mood) {
    case "happy":
      return { emoji: "😊", color: "#4CAF50" };
    case "sad":
      return { emoji: "😔", color: "#2196F3" };
    case "angry":
      return { emoji: "😠", color: "#FF5722" };
    case "excited":
      return { emoji: "😃", color: "#FFC107" };
    case "relaxed":
      return { emoji: "😌", color: "#8BC34A" };
    default:
      return { emoji: "❓", color: "#9CA3AF" };
  }
};

const Home = () => {
  const [recentJournals, setRecentJournals] = useState<Journal[]>([]);
  const [moodDistribution, setMoodDistribution] = useState<
    Record<string, number>
  >({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now()); // Track last update time

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await getAllJournalData();

      // Sort by date created, newest first
      const sortedData = [...data].sort((a, b) => {
        return (
          new Date(b.dateCreated || "").getTime() -
          new Date(a.dateCreated || "").getTime()
        );
      });

      // Take the 2 most recent entries
      setRecentJournals(sortedData.slice(0, 2));

      // Calculate mood distribution
      const moodCounts: Record<string, number> = {};
      data.forEach((journal) => {
        if (journal.mood) {
          moodCounts[journal.mood] = (moodCounts[journal.mood] || 0) + 1;
        }
      });
      setMoodDistribution(moodCounts);
    } catch (error) {
      console.error("Error fetching journal data:", error);
    } finally {
      setRefreshing(false);
      setLastUpdate(Date.now());
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // This effect runs when the component becomes visible after navigation
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // Refresh every minute when active

    return () => clearInterval(interval);
  }, [fetchData]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchData();
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get most common mood
  const getMostCommonMood = () => {
    let maxCount = 0;
    let mostCommonMood = "";

    Object.entries(moodDistribution).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonMood = mood;
      }
    });

    return mostCommonMood;
  };

  const mostCommonMood = getMostCommonMood();

  return (
    <View className="flex-1 bg-gradient-to-b from-[#D3BDF3] to-[#E6CFFF]">
      {/* Background Blobs */}
      <View className="absolute top-[-15%] left-[-10%] w-60 h-60 bg-[#FFC1CC] rounded-full opacity-40 blur-md" />
      <View className="absolute bottom-[-20%] right-[-15%] w-72 h-72 bg-[#FFB6C1] rounded-full opacity-30 blur-md" />

      {/* Header with Logo */}
      <View className="bg-[#A084DC] pt-10 pb-6 px-6 flex-row items-center">
        <Image
          source={{ uri: "https://example.com/diarydrift-logo.png" }} // Replace with actual logo URI
          style={{ width: 40, height: 40, marginRight: 10 }}
        />
        <Text className="text-white text-2xl font-bold">DiaryDrift</Text>
      </View>

      <ScrollView
        className="flex-1 p-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Welcome Section */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <Text className="text-gray-800 text-xl font-semibold mb-4">
            Welcome to Your Sanctuary
          </Text>
          <Text className="text-gray-600 mb-4">
            Reflect and unwind with DiaryDrift on{" "}
            {new Date().toLocaleDateString()}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("../journals/new")}
            className="bg-[#A084DC] p-3 rounded-xl flex-row items-center justify-center"
          >
            <Text className="text-white font-medium text-base mr-2">
              Start Writing
            </Text>
            <Text className="text-white text-xl">✍️</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Insights */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <Text className="text-gray-800 text-xl font-semibold mb-4">
            Mood Insights
          </Text>
          <View className="bg-[#F8F4FF] p-4 rounded-xl border border-[#E6CFFF]">
            {Object.keys(moodDistribution).length > 0 ? (
              <View>
                <View className="flex-row items-center mb-4">
                  <Text style={{ fontSize: 28 }}>
                    {getMoodEmoji(mostCommonMood).emoji}
                  </Text>
                  <Text className="ml-3 text-gray-800 font-medium text-lg capitalize">
                    {mostCommonMood || "No dominant mood"}
                  </Text>
                </View>
                {Object.entries(moodDistribution).map(([mood, count]) => {
                  const { emoji, color } = getMoodEmoji(mood);
                  const total = Object.values(moodDistribution).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = Math.round((count / total) * 100);
                  return (
                    <View key={mood} className="mb-3">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text style={{ fontSize: 18 }}>{emoji}</Text>
                        <Text className="text-gray-700 capitalize">{mood}</Text>
                        <Text className="text-gray-500">{count} entries</Text>
                      </View>
                      <View className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
                <TouchableOpacity
                  onPress={handleRefresh}
                  className="bg-[#E6CFFF] p-2 rounded-lg mt-4 self-center"
                >
                  <Text className="text-[#A084DC] text-center">
                    Update Insights
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-4">
                <Ionicons name="analytics-outline" size={32} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">No mood data yet</Text>
                <Text className="text-[#A084DC] mt-1">
                  Begin journaling to see trends
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <Text className="text-gray-800 text-xl font-semibold mb-5">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            {["Memories", "Journals", "Insights"].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-[#F8F4FF] p-4 rounded-xl w-[30%] items-center"
                onPress={() =>
                  item === "Memories"
                    ? router.push("../memories")
                    : item === "Journals"
                    ? router.push("../journals")
                    : router.push("../insights")
                }
              >
                <View className="h-12 w-12 bg-[#D3BDF3] rounded-full items-center justify-center mb-3">
                  <Text className="text-[#A084DC] text-xl">
                    {item === "Memories"
                      ? "📅"
                      : item === "Journals"
                      ? "📓"
                      : "📈"}
                  </Text>
                </View>
                <Text className="text-gray-800 text-center font-medium">
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Entries */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <Text className="text-gray-800 text-xl font-semibold mb-5">
            Recent Entries
          </Text>
          {recentJournals.length > 0 ? (
            recentJournals.map((journal) => (
              <TouchableOpacity
                key={journal.id}
                className="bg-[#F8F4FF] p-4 rounded-xl mb-4"
                onPress={() => router.push(`../journals/${journal.id}`)}
              >
                <View className="flex-row items-center">
                  <View className="h-12 w-12 bg-[#E6CFFF] rounded-full items-center justify-center">
                    {journal.mood ? (
                      <Text>{getMoodEmoji(journal.mood).emoji}</Text>
                    ) : (
                      <Text className="text-[#A084DC]">📝</Text>
                    )}
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-gray-800 font-medium">
                      {journal.title}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {formatDate(journal.dateCreated)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-[#F8F4FF] p-4 rounded-xl mb-4 items-center">
              <Text className="text-gray-500">No entries yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
