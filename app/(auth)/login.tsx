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
    <View className="flex-1 bg-[#E6D7FF]">
      {/* Background Blobs */}
      <View className="absolute top-[-15%] left-[-15%] w-48 h-48 bg-[#FFB3BA] rounded-full opacity-60" />
      <View className="absolute top-[20%] right-[-20%] w-64 h-64 bg-[#FFB3BA] rounded-full opacity-40" />
      <View className="absolute bottom-[-15%] right-[-10%] w-56 h-56 bg-[#FFB3BA] rounded-full opacity-50" />
      <View className="absolute bottom-[10%] left-[-15%] w-40 h-40 bg-[#FFB3BA] rounded-full opacity-30" />

      <View className="flex-1 justify-center px-6">
        <View className="bg-white/90 backdrop-blur-sm rounded-[25px] shadow-xl p-8 max-w-lg w-full mx-auto">
          <Text className="text-4xl font-bold text-center text-gray-800 mb-2">
            Log in
          </Text>

          <View className="mb-6">
            <Text className="text-gray-600 text-sm font-medium mb-2 ml-1">
              EMAIL
            </Text>
            <TextInput
              placeholder="astanger@gmail.com"
              className="border border-gray-200 bg-gray-50 rounded-[15px] p-4 text-base text-gray-800 font-medium"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 text-sm font-medium mb-2 ml-1">
              PASSWORD
            </Text>
            <TextInput
              placeholder="••••••••••"
              className="border border-gray-200 bg-gray-50 rounded-[15px] p-4 text-base text-gray-800 font-medium"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <View className="w-4 h-4 border border-gray-300 rounded-sm mr-2 bg-white" />
              <Text className="text-gray-600 text-sm">Remember me</Text>
            </View>
            <Pressable>
              <Text className="text-[#A084DC] text-sm font-medium">
                Forgot password?
              </Text>
            </Pressable>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-[#A084DC] p-4 rounded-[15px] shadow-md active:bg-[#8B5CF6] mb-6"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                SIGN IN
              </Text>
            )}
          </TouchableOpacity>

          <Pressable onPress={() => router.push("/register")}>
            <Text className="text-gray-600 text-center text-sm">
              Not registered yet?{" "}
              <Text className="text-[#A084DC] font-semibold">Sign Up</Text>
            </Text>
          </Pressable>

          {/* Social Login Icons */}
          <View className="flex-row justify-center items-center mt-6 space-x-4">
            <View className="w-10 h-10 bg-[#4267B2] rounded-full justify-center items-center">
              <Text className="text-white font-bold text-lg">f</Text>
            </View>
            <View className="w-10 h-10 bg-white border border-gray-200 rounded-full justify-center items-center">
              <Text className="text-[#DB4437] font-bold text-lg">G</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
