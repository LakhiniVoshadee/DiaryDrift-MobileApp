import { getAllTaskData } from "@/services/taskService";
import { Task } from "@/types/tasks";
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

const TaskScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const handleFetchData = async () => {
    await getAllTaskData()
      .then((data) => {
        console.log(data);
        setTasks(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const segment = useSegments();

  useEffect(() => {
    handleFetchData();
  }, [segment]);
  const router = useRouter();

  const handleDelete = () => {
    Alert.alert("Alert Title", "Alert Message", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ]);
  };
  return (
    <View className="flex-1 w-full justify-center items-center">
      <Text className="text-4xl text-center">Task Screen</Text>
      <View className="absolute bottom-6 right-5">
        <Pressable onPress={() => router.push("/(dashboard)/tasks/new")}>
          <Ionicons name="add-circle-sharp" size={60} color="black" />
        </Pressable>
      </View>
      <ScrollView className="mt-4">
        {tasks.map((task) => {
          return (
            <View
              key={task.id}
              className="bg-gray-200 p-4 mb-3 rounded-lg mx-4 border border-gray-400"
            >
              <Text className="text-lg font-semibold">{task.title}</Text>
              <Text className="text-sm text-gray-700 mb-2">
                {task.description}
              </Text>
              <View className="flex-row">
                <TouchableOpacity className="bg-yellow-300 px-3 py-1 rounded">
                  <Text className="text-xl">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-500 px-3 py-1 rounded">
                  <Text className="text-xl">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TaskScreen;
