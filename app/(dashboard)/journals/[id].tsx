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

// Define mood options with soft pastel colors
const moodOptions = [
  { value: "happy", label: "Happy", icon: "happy-outline", color: "#E8B4E3" },
  { value: "sad", label: "Sad", icon: "sad-outline", color: "#B4D4F1" },
  { value: "angry", label: "Angry", icon: "flame-outline", color: "#F2B4B4" },
  {
    value: "excited",
    label: "Excited",
    icon: "star-outline",
    color: "#F5D876",
  },
  {
    value: "relaxed",
    label: "Relaxed",
    icon: "leaf-outline",
    color: "#B8E8C1",
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
  const [mood, setMood] = useState<string | null>(null);

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
            if (journal.mood) setMood(journal.mood);
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
        mood: mood || undefined,
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
    <View className="flex-1" style={{ backgroundColor: "#E8D5FF" }}>
      {/* Dreamy Background Elements */}
      <View
        className="absolute opacity-30"
        style={{
          top: -80,
          right: -60,
          width: 200,
          height: 200,
          backgroundColor: "#FFB3E6",
          borderRadius: 100,
        }}
      />
      <View
        className="absolute opacity-20"
        style={{
          top: 100,
          left: -40,
          width: 150,
          height: 150,
          backgroundColor: "#FFD1DC",
          borderRadius: 75,
        }}
      />
      <View
        className="absolute opacity-25"
        style={{
          bottom: -60,
          right: -30,
          width: 180,
          height: 180,
          backgroundColor: "#E6E6FA",
          borderRadius: 90,
        }}
      />
      <View
        className="absolute opacity-15"
        style={{
          bottom: 200,
          left: -70,
          width: 220,
          height: 220,
          backgroundColor: "#F0E6FF",
          borderRadius: 110,
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-16 pb-8">
          {/* Header */}
          <View className="items-center mb-8">
            <Text
              className="text-3xl text-gray-800 text-center mb-2"
              style={{
                fontWeight: "300",
                letterSpacing: 1.5,
              }}
            >
              {isNew ? "Create Memory" : "Edit Memory"}
            </Text>
            <View
              style={{
                width: 50,
                height: 2,
                backgroundColor: "#C8A8E9",
                borderRadius: 1,
              }}
            />
          </View>

          {/* Title Input */}
          <View className="mb-6">
            <Text
              className="text-gray-700 mb-3 ml-2"
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#6B46C1",
              }}
            >
              Title
            </Text>
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(200, 168, 233, 0.3)",
                shadowColor: "#C8A8E9",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <TextInput
                placeholder="Give your memory a beautiful title..."
                value={title}
                onChangeText={setTitle}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  fontSize: 16,
                  color: "#374151",
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text
              className="text-gray-700 mb-3 ml-2"
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#6B46C1",
              }}
            >
              Your thoughts
            </Text>
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(200, 168, 233, 0.3)",
                shadowColor: "#C8A8E9",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <TextInput
                placeholder="Share what's on your mind..."
                value={description}
                onChangeText={setDescription}
                multiline
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  fontSize: 16,
                  color: "#374151",
                  height: 120,
                  textAlignVertical: "top",
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Mood Selection */}
          <View className="mb-6">
            <Text
              className="text-gray-700 mb-4 ml-2"
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#6B46C1",
              }}
            >
              How are you feeling?
            </Text>
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: "rgba(200, 168, 233, 0.3)",
                shadowColor: "#C8A8E9",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row justify-between">
                {moodOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setMood(option.value)}
                    className="items-center"
                    style={{
                      padding: 12,
                      borderRadius: 16,
                      backgroundColor:
                        mood === option.value
                          ? `${option.color}40`
                          : "rgba(255, 255, 255, 0.5)",
                      borderWidth: mood === option.value ? 2 : 1,
                      borderColor:
                        mood === option.value
                          ? option.color
                          : "rgba(200, 168, 233, 0.2)",
                    }}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={24}
                      color={mood === option.value ? option.color : "#9CA3AF"}
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        marginTop: 4,
                        color: mood === option.value ? option.color : "#9CA3AF",
                        fontWeight: mood === option.value ? "600" : "400",
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Photo Section */}
          <View className="mb-6">
            <Text
              className="text-gray-700 mb-3 ml-2"
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#6B46C1",
              }}
            >
              Capture the moment
            </Text>

            {photoBase64 ? (
              <View className="relative">
                <Image
                  source={{ uri: `data:image/jpeg;base64,${photoBase64}` }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "rgba(200, 168, 233, 0.3)",
                  }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={removePhoto}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    backgroundColor: "#FF6B9D",
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#FF6B9D",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Ionicons name="close" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  borderRadius: 20,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: "#C8A8E9",
                  padding: 32,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "#E8D5FF",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="camera-outline" size={28} color="#8B5CF6" />
                </View>
                <Text
                  style={{ color: "#8B5CF6", fontSize: 16, fontWeight: "500" }}
                >
                  Add a photo
                </Text>
                <Text style={{ color: "#9CA3AF", fontSize: 14, marginTop: 4 }}>
                  Tap to capture or select
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Voice Note Section */}
          <View className="mb-8">
            <Text
              className="text-gray-700 mb-3 ml-2"
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#6B46C1",
              }}
            >
              Voice memo
            </Text>

            {voiceNoteBase64 ? (
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "rgba(200, 168, 233, 0.3)",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={playVoiceNote}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: "#8B5CF6",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name="play" size={20} color="white" />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: "#374151",
                        fontSize: 16,
                        fontWeight: "500",
                      }}
                    >
                      Voice memo recorded
                    </Text>
                    <Text style={{ color: "#9CA3AF", fontSize: 14 }}>
                      Tap to play
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={removeVoiceNote}
                  style={{
                    backgroundColor: "#FF6B9D",
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                style={{
                  backgroundColor: isRecording ? "#FF6B9D" : "#8B5CF6",
                  borderRadius: 20,
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: isRecording ? "#FF6B9D" : "#8B5CF6",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Ionicons
                  name={isRecording ? "stop" : "mic"}
                  size={24}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: "#8B5CF6",
              borderRadius: 25,
              padding: 18,
              alignItems: "center",
              shadowColor: "#8B5CF6",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 6,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                letterSpacing: 0.5,
              }}
            >
              {isNew ? "Save Memory" : "Update Memory"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default JournalFormScreen;
