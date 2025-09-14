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
} from "react-native";

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
            } catch (err) {
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

  return (
    <View className="flex-1 w-full justify-center items-center">
      <Text className="text-4xl text-center">Journal</Text>
      <View className="absolute bottom-6 right-5">
        <Pressable onPress={() => router.push("../journals/new")}>
          <Ionicons name="add-circle-sharp" size={60} color="black" />
        </Pressable>
      </View>
      <ScrollView className="mt-4">
        {journals.map((journal) => (
          <View
            key={journal.id}
            className="bg-gray-200 p-4 mb-3 rounded-lg mx-4 border border-gray-400"
          >
            <Text className="text-lg font-semibold">{journal.title}</Text>
            <Text className="text-sm text-gray-700 mb-2">
              {journal.description}
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                className="bg-yellow-300 px-3 py-1 rounded mr-2"
                onPress={() => handleEdit(journal.id!)}
              >
                <Text className="text-xl">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 px-3 py-1 rounded"
                onPress={() => handleDelete(journal.id!)}
              >
                <Text className="text-xl">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default JournalScreen;