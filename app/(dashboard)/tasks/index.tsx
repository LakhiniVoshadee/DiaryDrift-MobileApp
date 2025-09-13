import { getAllTaskData, deleteTask } from "@/services/taskService";
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
  const router = useRouter();
  const segment = useSegments();

  const handleFetchData = async () => {
    try {
      const data = await getAllTaskData();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [segment]);

  const handleDelete = (taskId: string) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTask(taskId);
              await handleFetchData(); // Refetch after deletion!
            } catch (err) {
              Alert.alert("Error", "Could not delete task.");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (taskId: string) => {
    router.push(`/(dashboard)/tasks/${taskId}`);
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
        {tasks.map((task) => (
          <View
            key={task.id}
            className="bg-gray-200 p-4 mb-3 rounded-lg mx-4 border border-gray-400"
          >
            <Text className="text-lg font-semibold">{task.title}</Text>
            <Text className="text-sm text-gray-700 mb-2">
              {task.description}
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                className="bg-yellow-300 px-3 py-1 rounded mr-2"
                onPress={() => handleEdit(task.id!)}
              >
                <Text className="text-xl">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 px-3 py-1 rounded"
                onPress={() => handleDelete(task.id!)}
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

export default TaskScreen;