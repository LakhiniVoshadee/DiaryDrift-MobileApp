import { login } from "@/services/authService";
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

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await login(email, password)
      .then((res) => {
        router.push("/");
        Alert.alert("Login successful", "Welcome back!");
      })
      .catch(() => {
        Alert.alert("Login failed", "Invalid email or password.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View className="flex-1 bg-gray-50 justify-center px-4">
      <View className="bg-white rounded-xl shadow-md p-6 max-w-lg w-full mx-auto">
        <Text className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Login
        </Text>

        <TextInput
          placeholder="Email"
          className="border border-gray-200 bg-gray-100 rounded-md p-3 mb-4 text-base"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          className="border border-gray-200 bg-gray-100 rounded-md p-3 mb-6 text-base"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-indigo-600 p-3 rounded-md"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-center font-medium">Login</Text>
          )}
        </TouchableOpacity>
        <Pressable className="mt-4" onPress={() => router.push("/register")}>
          <Text className="text-indigo-600 text-center font-medium">
            Do not have an account? Register
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
