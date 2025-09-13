import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
} from "react-native";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [offlineReadingEnabled, setOfflineReadingEnabled] =
    React.useState(false);
  const [touchIDEnabled, setTouchIDEnabled] = React.useState(true);

  return (
    <View style={styles.container}>
      {/* Back Arrow and Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <Image
          style={styles.profileImage}
          source={{ uri: "https://via.placeholder.com/50" }} // Replace with actual user image URL
        />
        <View style={styles.profileDetails}>
          <Text style={styles.username}>trungtrung11096</Text>
          <Text style={styles.email}>trungtrung11096@gmail.com</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      {/* Option Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Option</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
            trackColor={{ false: "#d3d3d3", true: "#6b48ff" }}
            thumbColor={notificationsEnabled ? "#ffffff" : "#ffffff"}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Theme mode</Text>
          <Text style={styles.valueText}>Light</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Offline reading</Text>
          <Switch
            value={offlineReadingEnabled}
            onValueChange={() =>
              setOfflineReadingEnabled(!offlineReadingEnabled)
            }
            trackColor={{ false: "#d3d3d3", true: "#6b48ff" }}
            thumbColor={offlineReadingEnabled ? "#ffffff" : "#ffffff"}
          />
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Personal informations</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Country</Text>
          <Text style={styles.valueText}>Vietnam</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Language</Text>
          <Text style={styles.valueText}>English</Text>
        </TouchableOpacity>
      </View>

      {/* General Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Touch ID or passcode</Text>
          <Switch
            value={touchIDEnabled}
            onValueChange={() => setTouchIDEnabled(!touchIDEnabled)}
            trackColor={{ false: "#d3d3d3", true: "#6b48ff" }}
            thumbColor={touchIDEnabled ? "#ffffff" : "#ffffff"}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Display</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d7c4f0", // Light purple gradient base color
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    fontFamily: "System", // Mimics a modern sans-serif font
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    fontFamily: "System",
  },
  email: {
    fontSize: 14,
    color: "#666",
    fontFamily: "System",
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#9b59b6",
    borderRadius: 20,
  },
  editText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "System",
  },
  section: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    fontFamily: "System",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "System",
  },
  valueText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "System",
  },
  arrow: {
    fontSize: 20,
    color: "#666",
  },
});

export default Settings;
