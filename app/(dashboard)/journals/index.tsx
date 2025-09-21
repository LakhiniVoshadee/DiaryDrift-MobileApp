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

// Define mood icons and colors mapping
const moodIcons = {
  happy: { icon: "happy-outline", color: "#4CAF50" },
  sad: { icon: "sad-outline", color: "#2196F3" },
  angry: { icon: "flame-outline", color: "#FF5722" },
  excited: { icon: "star-outline", color: "#FFC107" },
  relaxed: { icon: "leaf-outline", color: "#8BC34A" },
};

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
      return { icon: "help-circle-outline", color: "#9E9E9E" };
    }
    return moodIcons[moodValue as keyof typeof moodIcons];
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#F8F4FF" }}>
      {/* Background Decorative Elements */}
      <View
        className="absolute -top-20 -right-20 opacity-10"
        style={{
          width: 200,
          height: 200,
          backgroundColor: "#F472B6",
          borderRadius: 100,
        }}
      />
      <View
        className="absolute -bottom-32 -left-16 opacity-10"
        style={{
          width: 160,
          height: 160,
          backgroundColor: "#A855F7",
          borderRadius: 80,
        }}
      />

      {/* Header Section */}
      <View className="pt-16 pb-8 px-6">
        <Text className="text-5xl font-light text-gray-800 text-center tracking-wide">
          Journal
        </Text>
        <Text className="text-lg text-gray-500 text-center mt-2 font-light">
          Your thoughts, beautifully organized
        </Text>
      </View>

      {/* Content Area */}
      <View className="flex-1 px-4">
        {journals.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="bg-white/70 rounded-3xl p-8 mx-4 shadow-lg border border-purple-100">
              <Ionicons
                name="journal-outline"
                size={80}
                color="#A855F7"
                style={{ alignSelf: "center", marginBottom: 16 }}
              />
              <Text className="text-2xl text-gray-700 text-center font-light mb-2">
                No entries yet
              </Text>
              <Text className="text-base text-gray-500 text-center">
                Start writing your story
              </Text>
            </View>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {journals.map((journal, index) => (
              <View
                key={journal.id}
                className="mb-6 mx-2"
                style={{
                  transform: [{ scale: 1 - index * 0.002 }],
                }}
              >
                <View
                  className="bg-white/80 rounded-2xl p-6 border border-purple-100/50"
                  style={{
                    shadowColor: "#A855F7",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  {/* Journal Header with Title and Mood */}
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-2xl font-medium text-gray-800 leading-7 flex-1">
                      {journal.title}
                    </Text>

                    {journal.mood && (
                      <View
                        className="rounded-full p-2"
                        style={{
                          backgroundColor: `${
                            getMoodDisplay(journal.mood).color
                          }15`,
                        }}
                      >
                        <Ionicons
                          name={getMoodDisplay(journal.mood).icon as any}
                          size={24}
                          color={getMoodDisplay(journal.mood).color}
                        />
                      </View>
                    )}
                  </View>

                  {/* Content */}
                  <View className="mb-6">
                    <Text className="text-base text-gray-600 leading-6 font-light">
                      {journal.description}
                    </Text>

                    {/* Display photo if exists */}
                    {journal.photoBase64 && (
                      <View className="mt-3">
                        <Image
                          source={{
                            uri: `data:image/jpeg;base64,${journal.photoBase64}`,
                          }}
                          style={{
                            width: "100%",
                            height: 160,
                            borderRadius: 8,
                          }}
                          resizeMode="cover"
                        />
                      </View>
                    )}

                    {/* Display voice note indicator if exists */}
                    {journal.voiceNoteBase64 && (
                      <View className="flex-row items-center mt-3 bg-purple-50 p-3 rounded-lg">
                        <Ionicons
                          name="mic-outline"
                          size={20}
                          color="#7C3AED"
                        />
                        <Text className="text-purple-700 ml-2">
                          Voice Memo Available
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row justify-end space-x-3">
                    <TouchableOpacity
                      className="px-6 py-3 rounded-xl"
                      onPress={() => handleEdit(journal.id!)}
                      style={{
                        backgroundColor: "#A855F7",
                        shadowColor: "#A855F7",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color="white"
                        />
                        <Text className="text-white font-medium ml-2 text-base">
                          Edit
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="px-6 py-3 rounded-xl"
                      onPress={() => handleDelete(journal.id!)}
                      style={{
                        backgroundColor: "#EF4444",
                        shadowColor: "#EF4444",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="white"
                        />
                        <Text className="text-white font-medium ml-2 text-base">
                          Delete
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Floating Add Button */}
      <View className="absolute bottom-8 right-6">
        <Pressable
          onPress={() => router.push("../journals/new")}
          className="rounded-full p-4"
          style={{
            backgroundColor: "#7C3AED",
            shadowColor: "#7C3AED",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={32} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default JournalScreen;