import { getAllJournalData, deleteJournal } from "@/services/journalService";
import { Journal } from "@/types/journal";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

// Define mood icons and colors mapping with pastel colors
const moodIcons = {
  happy: { icon: "happy-outline", color: "#FFB5D1", bgColor: "#FFF0F5" },
  sad: { icon: "sad-outline", color: "#A8D8FF", bgColor: "#F0F8FF" },
  angry: { icon: "flame-outline", color: "#FFB3BA", bgColor: "#FFF5F5" },
  excited: { icon: "star-outline", color: "#FFDFBA", bgColor: "#FFFBF0" },
  relaxed: { icon: "leaf-outline", color: "#BAFFC9", bgColor: "#F0FFF4" },
};

// Pastel colors for journal entries
const pastelColors = [
  { bg: "#FFE5CC", pill: "#FF9A6B", text: "#8B4513" }, // Peach
  { bg: "#E5CCFF", pill: "#C788FF", text: "#6A4C93" }, // Purple
  { bg: "#CCFFE5", pill: "#6BFF9A", text: "#2E8B57" }, // Mint
  { bg: "#FFE5E5", pill: "#FF8A8A", text: "#CD5C5C" }, // Pink
  { bg: "#E5F3FF", pill: "#8AC6FF", text: "#4682B4" }, // Blue
  { bg: "#FFF5CC", pill: "#FFD93D", text: "#DAA520" }, // Yellow
];

const JournalScreen = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const router = useRouter();
  const segment = useSegments();

  const handleFetchData = async () => {
    try {
      const data = await getAllJournalData();
      setJournals(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [segment]);

  const handleDelete = (journalId: string) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this journal entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteJournal(journalId);
              await handleFetchData();
            } catch {
              Alert.alert("Error", "Could not delete journal entry.");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (journalId: string) => {
    router.push(`../journals/${journalId}`);
  };

  // Helper function to get mood display information
  const getMoodDisplay = (moodValue: string | undefined) => {
    if (!moodValue || !moodIcons[moodValue as keyof typeof moodIcons]) {
      return {
        icon: "help-circle-outline",
        color: "#9E9E9E",
        bgColor: "#F5F5F5",
      };
    }
    return moodIcons[moodValue as keyof typeof moodIcons];
  };

  // Get color scheme for each journal entry
  const getColorScheme = (index: number) => {
    return pastelColors[index % pastelColors.length];
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#E6D7FF" }}>
      {/* Header Section */}
      <View className="pt-16 pb-8 px-6">
        <Text
          className="text-4xl text-gray-800 text-center mb-2"
          style={{
            fontWeight: "300",
            letterSpacing: 1,
          }}
        >
          My Journal
        </Text>
        <Text className="text-base text-gray-500 text-center font-light">
          Daily reflections & memories
        </Text>
      </View>

      {/* Content Area */}
      <View className="flex-1 px-6">
        {journals.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View
              className="p-12 mx-4 rounded-3xl"
              style={{
                backgroundColor: "#FFE5CC",
                borderWidth: 1,
                borderColor: "rgba(160, 132, 220, 0.2)",
              }}
            >
              <View className="items-center">
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "#FF9A6B",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <Ionicons name="journal-outline" size={36} color="white" />
                </View>
                <Text
                  className="text-xl text-center font-light mb-2"
                  style={{ color: "#8B4513" }}
                >
                  Start your journey
                </Text>
                <Text
                  className="text-sm text-center leading-5"
                  style={{ color: "#A0522D" }}
                >
                  Create your first entry to begin{"\n"}capturing precious
                  moments
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {/* Timeline Container */}
            <View className="relative">
              {/* Timeline Line */}
              <View
                className="absolute left-12 top-0 bottom-0"
                style={{
                  width: 2,
                  backgroundColor: "#A084DC", // Changed from yellow to aesthetic purple
                  marginLeft: 20,
                }}
              />

              {journals.map((journal, index) => {
                const colorScheme = getColorScheme(index);
                const currentDate = new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <View key={journal.id} className="relative mb-6">
                    {/* Timeline Pill */}
                    <View
                      className="absolute left-0 top-4"
                      style={{
                        width: 80,
                        height: 120,
                        borderRadius: 40,
                        backgroundColor: colorScheme.pill,
                        justifyContent: "center",
                        alignItems: "center",
                        shadowColor: colorScheme.pill,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5,
                      }}
                    >
                      <Text
                        className="text-white text-center font-bold transform -rotate-90"
                        style={{
                          fontSize: 12,
                          letterSpacing: 1,
                        }}
                      >
                        {journal.mood || "Entry"}
                      </Text>
                    </View>

                    {/* Content Card */}
                    <View className="ml-24 pl-6">
                      <View
                        className="rounded-2xl p-6"
                        style={{
                          backgroundColor: colorScheme.bg,
                          borderWidth: 1,
                          borderColor: "rgba(160, 132, 220, 0.2)",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 8,
                          elevation: 3,
                        }}
                      >
                        {/* Header with time and mood */}
                        <View className="flex-row items-center mb-3">
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={colorScheme.text}
                            style={{ opacity: 0.7 }}
                          />
                          <Text
                            className="ml-2 font-medium"
                            style={{
                              color: colorScheme.text,
                              fontSize: 14,
                              opacity: 0.8,
                            }}
                          >
                            {currentDate}
                          </Text>

                          {journal.mood && (
                            <View className="ml-auto">
                              <View
                                style={{
                                  backgroundColor: getMoodDisplay(journal.mood)
                                    .bgColor,
                                  paddingHorizontal: 8,
                                  paddingVertical: 4,
                                  borderRadius: 12,
                                }}
                              >
                                <Ionicons
                                  name={
                                    getMoodDisplay(journal.mood).icon as any
                                  }
                                  size={16}
                                  color={getMoodDisplay(journal.mood).color}
                                />
                              </View>
                            </View>
                          )}
                        </View>

                        {/* Title */}
                        <Text
                          className="text-lg font-semibold mb-2 leading-6"
                          style={{ color: colorScheme.text }}
                        >
                          {journal.title}
                        </Text>

                        {/* Description */}
                        <Text
                          className="leading-5 mb-4"
                          style={{
                            color: colorScheme.text,
                            fontSize: 14,
                            opacity: 0.8,
                          }}
                        >
                          {journal.description}
                        </Text>

                        {/* Display photo if exists */}
                        {journal.photoBase64 && (
                          <View className="mb-4">
                            <Image
                              source={{
                                uri: `data:image/jpeg;base64,${journal.photoBase64}`,
                              }}
                              style={{
                                width: "100%",
                                height: 120,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: "rgba(255, 255, 255, 0.7)",
                              }}
                              resizeMode="cover"
                            />
                          </View>
                        )}

                        {/* Display voice note indicator if exists */}
                        {journal.voiceNoteBase64 && (
                          <View
                            className="flex-row items-center mb-4"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.4)",
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 20,
                            }}
                          >
                            <Ionicons
                              name="mic-outline"
                              size={16}
                              color={colorScheme.text}
                            />
                            <Text
                              className="ml-2 text-xs"
                              style={{ color: colorScheme.text }}
                            >
                              Voice memo attached
                            </Text>
                          </View>
                        )}

                        {/* Action Buttons */}
                        <View
                          className="flex-row justify-end"
                          style={{ gap: 8 }}
                        >
                          <TouchableOpacity
                            onPress={() => handleEdit(journal.id!)}
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.6)",
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderRadius: 20,
                              borderWidth: 1,
                              borderColor: "rgba(255, 255, 255, 0.8)",
                            }}
                          >
                            <View className="flex-row items-center">
                              <Ionicons
                                name="create-outline"
                                size={14}
                                color={colorScheme.text}
                              />
                              <Text
                                className="ml-1 text-xs font-medium"
                                style={{ color: colorScheme.text }}
                              >
                                Edit
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleDelete(journal.id!)}
                            style={{
                              backgroundColor: "#FFB3BA",
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderRadius: 20,
                              borderWidth: 1,
                              borderColor: "rgba(255, 179, 186, 0.8)",
                            }}
                          >
                            <View className="flex-row items-center">
                              <Ionicons
                                name="trash-outline"
                                size={14}
                                color="#8B0000"
                              />
                              <Text
                                className="ml-1 text-xs font-medium"
                                style={{ color: "#8B0000" }}
                              >
                                Delete
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Floating Add Button */}
      <View className="absolute bottom-8 right-8">
        <Pressable
          onPress={() => router.push("../journals/new")}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "#A084DC",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#A084DC",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
            borderWidth: 2,
            borderColor: "#8B5CF6",
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default JournalScreen;
