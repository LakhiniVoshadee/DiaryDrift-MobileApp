import { useLoader } from "@/context/LoaderContext";
import { createJournal, getJournalById, updateJournal } from "@/services/journalService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const JournalFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNew = !id || id === "new";

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const router = useRouter();
  const { hideLoader, showLoader } = useLoader();

  useEffect(() => {
    const load = async () => {
      if (!isNew && id) {
        try {
          showLoader();
          const journal = await getJournalById(id);
          if (journal) {
            setTitle(journal.title);
            setDescription(journal.description);
          }
        } finally {
          hideLoader();
        }
      }
    };
    load();
  }, [hideLoader, id, isNew, showLoader]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Title is required.");
      return;
    }
    try {
      showLoader();
      if (isNew) {
        await createJournal({ title, description });
      } else if (id) {
        await updateJournal(id, { title, description });
      }
      router.back();
    } catch (err) {
      console.error("Error saving journal:", err);
      Alert.alert("Error", "Could not save journal entry.");
    } finally {
      hideLoader();
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <Text className="text-2xl font-bold text-gray-800 text-center mb-8 tracking-tight">
        {isNew ? "Add New Journal Entry" : "Edit Journal Entry"}
      </Text>

      <TextInput
        placeholder="Journal Title"
        value={title}
        onChangeText={setTitle}
        className="border border-gray-200 rounded-xl px-5 py-4 mb-5 bg-white shadow-sm text-gray-700 text-base font-medium"
        placeholderTextColor="#9CA3AF"
      />

      <TextInput
        placeholder="Write your thoughts here..."
        value={description}
        onChangeText={setDescription}
        className="border border-gray-200 rounded-xl px-5 py-4 mb-5 bg-white shadow-sm text-gray-700 text-base font-medium h-36"
        multiline
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity
        className="bg-indigo-600 py-4 rounded-xl shadow-md"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold text-lg tracking-wide">
          {isNew ? "Create Journal Entry" : "Update Journal Entry"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default JournalFormScreen;