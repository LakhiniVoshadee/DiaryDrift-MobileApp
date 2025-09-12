import { register } from "@/services/authService";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (isLoading) return; // Prevent multiple submissions
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    await register(email, password)
      .then((res) => {
        router.back();
        Alert.alert("Registration successful", "You can now log in.");
      })
      .catch(() => {
        Alert.alert("Registration failed", "Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <View className="flex-1 bg-gray-50 justify-center px-4">
      <View className="bg-white rounded-xl shadow-md p-6 max-w-lg w-full mx-auto">
        <Text className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Register
        </Text>

        <TextInput
          placeholder="Email"
          className="border border-gray-200 bg-blue-100 rounded-md p-3 mb-4 text-base text-black"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          className="border border-gray-200 bg-blue-100 rounded-md p-3 mb-4 text-base text-black"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          className="border border-gray-200 bg-blue-100 rounded-md p-3 mb-6 text-base"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={handleRegister}
          className="bg-indigo-600 p-3 rounded-md"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-center font-medium">Register</Text>
          )}
        </TouchableOpacity>

        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="text-indigo-600 text-center font-medium">
            Already have an account? Log in
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Register;
