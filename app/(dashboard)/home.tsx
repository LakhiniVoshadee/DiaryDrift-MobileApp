import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
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
  const [moodDistribution, setMoodDistribution] = useState<Record<string, number>>({});
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
    // Create focus listener for screen focus
    const interval = setInterval(() => {
      // Check if screen is focused by checking if component is mounted
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
      <View className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-[#FFC1CC] rounded-full opacity-50 blur-md" />
      <View className="absolute bottom-[-15%] right-[-10%] w-48 h-48 bg-[#FFC1CC] rounded-full opacity-40 blur-md" />

      {/* Header */}
      <View className="bg-[#A084DC] pt-12 pb-4 px-5">
        <Text className="text-white text-2xl font-bold">DiaryDrift</Text>
        <Text className="text-white text-sm mt-1">
          Your journaling sanctuary
        </Text>
      </View>

      <ScrollView 
        className="flex-1 p-4" 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
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
                onPress={() => router.push("../journals/new")}
                className="bg-[#A084DC] p-2 rounded-full"
              >
                <Text className="text-white text-sm font-medium">✍️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mood Analysis Card */}
          <View className="mb-6">
            <Text className="text-gray-800 text-lg font-semibold mb-3">
              Your Mood
            </Text>
            <View className="bg-[#F8F4FF] p-4 rounded-xl border border-[#E6CFFF]">
              {Object.keys(moodDistribution).length > 0 ? (
                <View>
                  <View className="flex-row items-center mb-3">
                    <Text style={{ fontSize: 24 }}>
                      {getMoodEmoji(mostCommonMood).emoji}
                    </Text>
                    <Text className="ml-2 text-gray-800 font-medium capitalize">
                      Most common: {mostCommonMood || "None"}
                    </Text>
                  </View>

                  {/* Mood distribution chart */}
                  <View className="mb-3">
                    {Object.entries(moodDistribution).map(([mood, count]) => {
                      const { emoji, color } = getMoodEmoji(mood);
                      // Calculate percentage based on total
                      const total = Object.values(moodDistribution).reduce((a, b) => a + b, 0);
                      const percentage = Math.round((count / total) * 100);
                      
                      return (
                        <View key={mood} className="mb-2">
                          <View className="flex-row items-center justify-between mb-1">
                            <View className="flex-row items-center">
                              <Text style={{ fontSize: 16 }}>{emoji}</Text>
                              <Text className="ml-1 text-gray-700 capitalize">{mood}</Text>
                            </View>
                            <Text className="text-gray-500 text-xs">{count} entries</Text>
                          </View>
                          <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <View 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: color
                              }} 
                            />
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  <TouchableOpacity 
                    onPress={handleRefresh}
                    className="bg-purple-100 p-2 rounded-lg self-center mt-2"
                  >
                    <Text className="text-purple-700 text-center">Refresh Data</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="items-center py-4">
                  <Ionicons name="analytics-outline" size={28} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-2 mb-2">No mood data yet</Text>
                  <Text className="text-purple-700">
                    Start tracking your mood in journal entries
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Quick Journal Actions */}
          <Text className="text-gray-800 text-lg font-semibold mb-4">
            Journal Tools
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {["Memories", "Journals", "Insights"].map((item, index) => (
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
                    : item === "Journals"
                    ? router.push("../journals")
                    : router.push("../insights")
                }
              >
                <View className="h-12 w-12 bg-[#D3BDF3] rounded-full items-center justify-center mb-2">
                  <Text className="text-[#A084DC] text-xl">
                    {item === "Memories" ? "📅" : item === "Journals" ? "📓" : "📈"}
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
          {recentJournals.length > 0 ? (
            recentJournals.map((journal) => (
              <TouchableOpacity
                key={journal.id}
                className="bg-white p-4 rounded-lg mb-4 shadow-md border border-gray-100"
                onPress={() => router.push(`../journals/${journal.id}`)}
              >
                <View className="flex-row items-center">
                  <View className="h-10 w-10 bg-[#E6CFFF] rounded-full items-center justify-center">
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
                    <Text className="text-gray-500 text-sm mt-1">
                      Written at {formatDate(journal.dateCreated)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-white p-4 rounded-lg mb-4 shadow-md border border-gray-100">
              <Text className="text-gray-500 text-center py-2">
                No journal entries yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;