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
      return { emoji: "😊", color: "#F4A261" };
    case "sad":
      return { emoji: "😔", color: "#E76F51" };
    case "angry":
      return { emoji: "😠", color: "#E9C46A" };
    case "excited":
      return { emoji: "😃", color: "#2A9D8F" };
    case "relaxed":
      return { emoji: "😌", color: "#264653" };
    default:
      return { emoji: "❓", color: "#E76F51" };
  }
};

const Home = () => {
  const [recentJournals, setRecentJournals] = useState<Journal[]>([]);
  const [moodDistribution, setMoodDistribution] = useState<
    Record<string, number>
  >({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

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
    <View className="flex-1" style={{ backgroundColor: "#E8D5FF" }}>
      {/* Header */}
      <View 
        className="pt-12 pb-6 px-6"
        style={{
          backgroundColor: "#C8A8E9",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <Text 
          className="text-center text-2xl font-bold"
          style={{ 
            color: "#4A1A5C",
            fontFamily: 'System'
          }}
        >
          DiaryDrift
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Decorative Stickers Container */}
        <View className="relative mb-6">
          {/* Heart Sticker */}
          <View
            className="absolute z-10"
            style={{
              top: -10,
              left: 20,
              backgroundColor: "#E8B4E3",
              width: 40,
              height: 36,
              borderRadius: 20,
              transform: [{ rotate: '-15deg' }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-1 justify-center items-center">
              <Text style={{ fontSize: 20, color: 'white' }}>♥</Text>
            </View>
          </View>

          {/* Star Sticker */}
          <View
            className="absolute z-10"
            style={{
              top: -15,
              right: 30,
              backgroundColor: "#C8A8E9",
              width: 45,
              height: 45,
              borderRadius: 22,
              transform: [{ rotate: '20deg' }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-1 justify-center items-center">
              <Text style={{ fontSize: 20 }}>⭐</Text>
            </View>
          </View>

          {/* Plant Sticker */}
          <View
            className="absolute z-10"
            style={{
              top: 20,
              left: 10,
              backgroundColor: "#B39BC7",
              width: 38,
              height: 42,
              borderRadius: 19,
              transform: [{ rotate: '-8deg' }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-1 justify-center items-center">
              <Text style={{ fontSize: 18 }}>🌱</Text>
            </View>
          </View>

          {/* Motivational Quote Sticker */}
          <View
            className="absolute z-10"
            style={{
              bottom: -5,
              left: 15,
              backgroundColor: "#F5F0FF",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 16,
              transform: [{ rotate: '-5deg' }],
              borderWidth: 2,
              borderColor: "#C8A8E9",
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text 
              style={{ 
                fontSize: 12, 
                color: "#4A1A5C",
                fontWeight: '600',
                fontFamily: 'System'
              }}
            >
              believe in{'\n'}yourself
            </Text>
          </View>
        </View>

        {/* Main Content Card */}
        <View
          style={{
            backgroundColor: "#FFF",
            borderRadius: 24,
            padding: 20,
            marginTop: 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            borderWidth: 3,
            borderColor: "#C8A8E9",
          }}
        >
          {/* Mood Tracker Section */}
          <View className="mb-6">
            <View
              style={{
                backgroundColor: "#F5F0FF",
                borderRadius: 16,
                padding: 16,
                borderWidth: 2,
                borderColor: "#C8A8E9",
              }}
            >
              <Text 
                style={{ 
                  fontSize: 18, 
                  fontWeight: 'bold', 
                  color: "#4A1A5C",
                  marginBottom: 12,
                  fontFamily: 'cursive'
                }}
              >
                mood tracker
              </Text>
              
              {Object.keys(moodDistribution).length > 0 ? (
                <View>
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
                          <View
                            style={{
                              backgroundColor: color,
                              width: 32,
                              height: 32,
                              borderRadius: 16,
                              justifyContent: 'center',
                              alignItems: 'center',
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.1,
                              shadowRadius: 3,
                              elevation: 2,
                            }}
                          >
                            <Text style={{ fontSize: 16, color: 'white' }}>
                              {emoji}
                            </Text>
                          </View>
                          <Text 
                            className="capitalize"
                            style={{ 
                              color: "#4A1A5C", 
                              fontWeight: '500',
                              flex: 1,
                              marginLeft: 12
                            }}
                          >
                            {mood}
                          </Text>
                          <Text style={{ color: "#666", fontSize: 12 }}>
                            {count}
                          </Text>
                        </View>
                        <View 
                          style={{
                            height: 8,
                            backgroundColor: '#E5E5E5',
                            borderRadius: 4,
                            overflow: 'hidden',
                            marginLeft: 44
                          }}
                        >
                          <View
                            style={{
                              height: '100%',
                              width: `${percentage}%`,
                              backgroundColor: color,
                              borderRadius: 4,
                            }}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View className="items-center py-4">
                  <View
                    style={{
                      backgroundColor: "#C8A8E9",
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>😊</Text>
                  </View>
                  <Text style={{ color: "#666" }}>No mood data yet</Text>
                  <Text style={{ color: "#B39BC7", fontSize: 12 }}>
                    Begin journaling to see trends
                  </Text>
                </View>
              )}

              {/* Add Note Button */}
              <View
                className="absolute"
                style={{
                  bottom: -8,
                  right: -8,
                  backgroundColor: "#F5F0FF",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  transform: [{ rotate: '8deg' }],
                  borderWidth: 2,
                  borderColor: "#E8B4E3",
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <TouchableOpacity onPress={() => router.push("../journals/new")}>
                  <Text 
                    style={{ 
                      fontSize: 14, 
                      color: "#4A1A5C",
                      fontWeight: 'bold',
                      fontFamily: 'cursive'
                    }}
                  >
                    + Add{'\n'}Note
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Calendar Section */}
          <View className="mb-6">
            <View
              style={{
                backgroundColor: "#F7E6D3",
                borderRadius: 16,
                padding: 16,
                borderWidth: 2,
                borderColor: "#E9C46A",
              }}
            >
              {/* Month Header */}
              <View className="flex-row justify-between items-center mb-4">
                <Text 
                  style={{ 
                    fontSize: 24, 
                    fontWeight: 'bold', 
                    color: "#264653",
                    fontFamily: 'cursive'
                  }}
                >
                  {new Date().toLocaleDateString('en-US', { month: 'long' })}
                </Text>
              </View>

              {/* Calendar Grid */}
              <View>
                {/* Days Header */}
                <View className="flex-row justify-between mb-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                    <Text 
                      key={index}
                      style={{ 
                        color: "#666", 
                        fontSize: 12, 
                        fontWeight: '500',
                        width: 32,
                        textAlign: 'center'
                      }}
                    >
                      {day}
                    </Text>
                  ))}
                </View>

                {/* Calendar Days */}
                <View>
                  {/* Week 1 */}
                  <View className="flex-row justify-between mb-2">
                    <Text style={{ color: "#999", fontSize: 14, width: 32, textAlign: 'center' }}></Text>
                    <Text style={{ color: "#999", fontSize: 14, width: 32, textAlign: 'center' }}></Text>
                    <Text style={{ color: "#999", fontSize: 14, width: 32, textAlign: 'center' }}></Text>
                    <Text style={{ color: "#999", fontSize: 14, width: 32, textAlign: 'center' }}></Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center', fontWeight: '600' }}>1</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>2</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center', fontWeight: '600' }}>3</Text>
                  </View>

                  {/* Week 2 */}
                  <View className="flex-row justify-between mb-2">
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>4</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>5</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>6</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>7</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center', fontWeight: '600' }}>8</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>9</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center', fontWeight: '600' }}>10</Text>
                  </View>

                  {/* Week 3 with image */}
                  <View className="flex-row justify-between mb-2">
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>11</Text>
                    <View className="relative">
                      <View
                        style={{
                          width: 40,
                          height: 30,
                          backgroundColor: "#E76F51",
                          borderRadius: 6,
                          justifyContent: 'center',
                          alignItems: 'center',
                          transform: [{ rotate: '-3deg' }],
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                          elevation: 2,
                        }}
                      >
                        <Text style={{ color: 'white', fontSize: 10 }}>🌅</Text>
                      </View>
                      <Text 
                        style={{ 
                          position: 'absolute', 
                          bottom: -15, 
                          left: 8, 
                          color: "#264653", 
                          fontSize: 12, 
                          fontWeight: '600' 
                        }}
                      >
                        12
                      </Text>
                    </View>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>13</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center', fontWeight: '600' }}>14</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>15</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>16</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center', fontWeight: '600' }}>17</Text>
                  </View>

                  {/* Week 4 */}
                  <View className="flex-row justify-between mb-2">
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center', fontWeight: '600' }}>18</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>19</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>20</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center', fontWeight: '600' }}>21</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>22</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>23</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center', fontWeight: '600' }}>24</Text>
                  </View>

                  {/* Week 5 */}
                  <View className="flex-row justify-between">
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center', fontWeight: '600' }}>25</Text>
                    <Text style={{ color: "#264653", fontSize: 14, width: 32, textAlign: 'center' }}>26</Text>
                    <Text style={{ color: "#999", fontSize: 14, width: 32, textAlign: 'center' }}></Text>
                    <Text style={{ color: "#999", fontSize: 14, width: 32, textAlign: 'center' }}></Text>
                    <Text style={{ color: "#999", fontSize: 14, width: 32, textAlign: 'center' }}></Text>
                    <Text style={{ color: "#999", fontSize: 14, width: 32, textAlign: 'center' }}></Text>
                    <Text style={{ color: "#999", fontSize: 14, width: 32, textAlign: 'center' }}></Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Welcome Section */}
          <View className="mb-6">
            <Text 
              style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: "#264653",
                marginBottom: 8
              }}
            >
              Welcome to Your Sanctuary
            </Text>
            <Text style={{ color: "#666", marginBottom: 12 }}>
              Reflect and unwind with DiaryDrift on{" "}
              {new Date().toLocaleDateString()}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("../journals/new")}
              style={{
                backgroundColor: "#E9C46A",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text 
                style={{ 
                  color: "#264653", 
                  fontWeight: '600', 
                  fontSize: 16, 
                  marginRight: 8
                }}
              >
                Start Writing
              </Text>
              <Text style={{ fontSize: 18 }}>✍️</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Text 
              style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: "#264653",
                marginBottom: 16
              }}
            >
              Quick Actions
            </Text>
            <View className="flex-row justify-between">
              {["Memories", "Journals", "Insights"].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    item === "Memories"
                      ? router.push("../memories")
                      : item === "Journals"
                      ? router.push("../journals")
                      : router.push("../insights")
                  }
                  style={{
                    backgroundColor: "#F7E6D3",
                    borderRadius: 16,
                    padding: 16,
                    width: '30%',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: "#E9C46A",
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#E9C46A",
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>
                      {item === "Memories" ? "📅" : item === "Journals" ? "📓" : "📈"}
                    </Text>
                  </View>
                  <Text 
                    style={{ 
                      color: "#264653", 
                      fontSize: 12, 
                      fontWeight: '600',
                      textAlign: 'center'
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Entries */}
          <View>
            <Text 
              style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: "#264653",
                marginBottom: 16
              }}
            >
              Recent Entries
            </Text>
            {recentJournals.length > 0 ? (
              recentJournals.map((journal) => (
                <TouchableOpacity
                  key={journal.id}
                  onPress={() => router.push(`../journals/${journal.id}`)}
                  style={{
                    backgroundColor: "#F7E6D3",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: "#E9C46A",
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#E9C46A",
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    {journal.mood ? (
                      <Text style={{ fontSize: 18 }}>
                        {getMoodEmoji(journal.mood).emoji}
                      </Text>
                    ) : (
                      <Text style={{ fontSize: 18 }}>📝</Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text 
                      style={{ 
                        color: "#264653", 
                        fontWeight: '600',
                        fontSize: 14
                      }}
                    >
                      {journal.title}
                    </Text>
                    <Text style={{ color: "#666", fontSize: 12 }}>
                      {formatDate(journal.dateCreated)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View
                style={{
                  backgroundColor: "#F7E6D3",
                  borderRadius: 16,
                  padding: 20,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: "#E9C46A",
                }}
              >
                <Text style={{ color: "#666" }}>No entries yet</Text>
              </View>
            )}
          </View>

          {/* Bottom Call to Action */}
          <View
            className="absolute"
            style={{
              bottom: -12,
              alignSelf: 'center',
              backgroundColor: "#E76F51",
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 20,
              transform: [{ rotate: '-2deg' }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 4,
            }}
          >
            <TouchableOpacity onPress={() => router.push("../journals/new")}>
              <Text 
                style={{ 
                  color: "white", 
                  fontSize: 14, 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontFamily: 'cursive'
                }}
              >
                Start Journaling Your Way
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;