import { useLoader } from "@/context/LoaderContext";
import {
  createJournal,
  getJournalById,
  updateJournal,
} from "@/services/journalService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

// Define mood options
const moodOptions = [
  { value: "happy", label: "Happy", icon: "happy-outline", color: "#4CAF50" },
  { value: "sad", label: "Sad", icon: "sad-outline", color: "#2196F3" },
  { value: "angry", label: "Angry", icon: "flame-outline", color: "#FF5722" },
  {
    value: "excited",
    label: "Excited",
    icon: "star-outline",
    color: "#FFC107",
  },
  {
    value: "relaxed",
    label: "Relaxed",
    icon: "leaf-outline",
    color: "#8BC34A",
  },
];

const JournalFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [voiceNoteBase64, setVoiceNoteBase64] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mood, setMood] = useState<string | null>(null); // Added mood state

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
            if (journal.photoBase64) setPhotoBase64(journal.photoBase64);
            if (journal.voiceNoteBase64)
              setVoiceNoteBase64(journal.voiceNoteBase64);
            if (journal.mood) setMood(journal.mood); // Load saved mood
          }
        } finally {
          hideLoader();
        }
      }
    };
    load();
  }, [hideLoader, id, isNew, showLoader]);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need camera roll permission to upload photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        if (selectedAsset.base64) {
          setPhotoBase64(selectedAsset.base64);
        }
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while selecting the image.");
      console.error(error);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording", error);
      Alert.alert("Error", "Failed to start recording.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        const base64 = await convertAudioToBase64(uri);
        setVoiceNoteBase64(base64);
      }

      setRecording(null);
    } catch (error) {
      console.error("Failed to stop recording", error);
      Alert.alert("Error", "Failed to save recording.");
    }
  };

  const convertAudioToBase64 = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result?.toString();
          if (base64String) {
            // Remove the data URL prefix (e.g., 'data:audio/m4a;base64,')
            const base64 = base64String.split(",")[1] || base64String;
            resolve(base64);
          } else {
            reject(new Error("Failed to convert audio to base64"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting audio to base64:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Title is required.");
      return;
    }
    try {
      showLoader();

      const journalData = {
        title,
        description,
        photoBase64: photoBase64 || undefined,
        voiceNoteBase64: voiceNoteBase64 || undefined,
        mood: mood || undefined, // Include mood in journal data
      };

      if (isNew) {
        await createJournal(journalData);
      } else if (id) {
        await updateJournal(id, journalData);
      }
      router.back();
    } catch (err) {
      console.error("Error saving journal:", err);
      Alert.alert("Error", "Could not save journal entry.");
    } finally {
      hideLoader();
    }
  };

  const playVoiceNote = async () => {
    if (!voiceNoteBase64) return;

    try {
      // Create a temporary file URI for the voice note
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/m4a;base64,${voiceNoteBase64}` },
        { shouldPlay: true }
      );

      await sound.playAsync();
    } catch (error) {
      console.error("Failed to play voice note", error);
      Alert.alert("Error", "Failed to play voice note.");
    }
  };

  const removePhoto = () => {
    setPhotoBase64(null);
  };

  const removeVoiceNote = () => {
    setVoiceNoteBase64(null);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-6">
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

        {/* Mood Selection Section */}
        <View className="mb-5">
          <Text className="text-gray-700 font-medium mb-2">
            How are you feeling?
          </Text>
          <View className="flex-row justify-between bg-white p-4 rounded-lg">
            {moodOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setMood(option.value)}
                className={`items-center justify-center p-3 rounded-full ${
                  mood === option.value ? "bg-purple-100" : ""
                }`}
                style={{
                  borderWidth: mood === option.value ? 2 : 0,
                  borderColor: option.color,
                }}
              >
                <Ionicons
                  name={option.icon as any}
                  size={28}
                  color={mood === option.value ? option.color : "#9CA3AF"}
                />
                <Text
                  className={`text-xs mt-1 ${
                    mood === option.value ? "font-medium" : "text-gray-500"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Photo Section */}
        <View className="mb-5">
          <Text className="text-gray-700 font-medium mb-2">Photo</Text>

          {photoBase64 ? (
            <View className="relative">
              <Image
                source={{ uri: `data:image/jpeg;base64,${photoBase64}` }}
                className="w-full h-48 rounded-lg"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={removePhoto}
                className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={pickImage}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-24"
            >
              <Ionicons name="image-outline" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Voice Note Section */}
        <View className="mb-5">
          <Text className="text-gray-700 font-medium mb-2">Voice Note</Text>

          {voiceNoteBase64 ? (
            <View className="flex-row items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
              <TouchableOpacity
                onPress={playVoiceNote}
                className="flex-row items-center"
              >
                <Ionicons name="play" size={24} color="#7C3AED" />
                <Text className="text-gray-700 ml-2">Play Recording</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={removeVoiceNote}
                className="bg-red-500 p-2 rounded-full"
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              className={`flex-row items-center justify-center p-4 rounded-lg ${
                isRecording ? "bg-red-500" : "bg-indigo-600"
              }`}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={24}
                color="white"
              />
              <Text className="text-white font-medium ml-2">
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-indigo-600 py-4 rounded-xl shadow-md mt-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold text-lg tracking-wide">
            {isNew ? "Create Journal Entry" : "Update Journal Entry"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default JournalFormScreen;