import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [offlineReadingEnabled, setOfflineReadingEnabled] =
    React.useState(false);
  const [touchIDEnabled, setTouchIDEnabled] = React.useState(true);

  return (
    <View style={styles.container}>
      {/* Floating Sticker Elements */}
      <View style={styles.heartSticker}>
        <Text style={styles.stickerEmoji}>❤️</Text>
      </View>
      <View style={styles.starSticker}>
        <Text style={styles.stickerEmoji}>⭐</Text>
      </View>
      <View style={styles.plantSticker}>
        <Text style={styles.stickerEmoji}>🌱</Text>
      </View>
      <View style={styles.motivationalSticker}>
        <Text style={styles.motivationalText}>believe in{"\n"}yourself</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Settings</Text>
        </View>

        {/* Main Content Card */}
        <View style={styles.mainCard}>
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                style={styles.profileImage}
                source={{ uri: "https://via.placeholder.com/60" }}
              />
            </View>
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
            <View style={styles.settingsFrame}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <View style={styles.settingIconContainer}>
                    <Text style={styles.settingIcon}>🔔</Text>
                  </View>
                  <Text style={styles.settingText}>Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={() =>
                    setNotificationsEnabled(!notificationsEnabled)
                  }
                  trackColor={{
                    false: "rgba(155, 89, 182, 0.2)",
                    true: "#9b59b6",
                  }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="rgba(155, 89, 182, 0.2)"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <View style={styles.settingIconContainer}>
                    <Text style={styles.settingIcon}>🎨</Text>
                  </View>
                  <Text style={styles.settingText}>Theme mode</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>Light</Text>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <View style={styles.settingIconContainer}>
                    <Text style={styles.settingIcon}>📖</Text>
                  </View>
                  <Text style={styles.settingText}>Offline reading</Text>
                </View>
                <Switch
                  value={offlineReadingEnabled}
                  onValueChange={() =>
                    setOfflineReadingEnabled(!offlineReadingEnabled)
                  }
                  trackColor={{
                    false: "rgba(155, 89, 182, 0.2)",
                    true: "#9b59b6",
                  }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="rgba(155, 89, 182, 0.2)"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.settingsFrame}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <View style={styles.settingIconContainer}>
                    <Text style={styles.settingIcon}>👤</Text>
                  </View>
                  <Text style={styles.settingText}>Personal informations</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <View style={styles.settingIconContainer}>
                    <Text style={styles.settingIcon}>🌍</Text>
                  </View>
                  <Text style={styles.settingText}>Country</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>Vietnam</Text>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <View style={styles.settingIconContainer}>
                    <Text style={styles.settingIcon}>🗣️</Text>
                  </View>
                  <Text style={styles.settingText}>Language</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>English</Text>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* General Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
            <View style={styles.settingsFrame}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <View style={styles.settingIconContainer}>
                    <Text style={styles.settingIcon}>🔐</Text>
                  </View>
                  <Text style={styles.settingText}>Touch ID or passcode</Text>
                </View>
                <Switch
                  value={touchIDEnabled}
                  onValueChange={() => setTouchIDEnabled(!touchIDEnabled)}
                  trackColor={{
                    false: "rgba(155, 89, 182, 0.2)",
                    true: "#9b59b6",
                  }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="rgba(155, 89, 182, 0.2)"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingItem, styles.lastSettingItem]}
              >
                <View style={styles.settingContent}>
                  <View style={styles.settingIconContainer}>
                    <Text style={styles.settingIcon}>📱</Text>
                  </View>
                  <Text style={styles.settingText}>Display</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d7c4f0",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Floating Sticker Elements
  heartSticker: {
    position: "absolute",
    top: 120,
    left: 30,
    width: 50,
    height: 45,
    backgroundColor: "#E8B4E3",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-15deg" }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  starSticker: {
    position: "absolute",
    top: 80,
    right: 40,
    width: 55,
    height: 55,
    backgroundColor: "#C8A8E9",
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "20deg" }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  plantSticker: {
    position: "absolute",
    top: 180,
    left: 15,
    width: 45,
    height: 50,
    backgroundColor: "#B39BC7",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-8deg" }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  motivationalSticker: {
    position: "absolute",
    bottom: 200,
    left: 25,
    backgroundColor: "#F5F0FF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 16,
    transform: [{ rotate: "-5deg" }],
    borderWidth: 2,
    borderColor: "#C8A8E9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  stickerEmoji: {
    fontSize: 22,
  },
  motivationalText: {
    fontSize: 12,
    color: "#4A1A5C",
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "System",
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    fontFamily: "System",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  mainCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#C8A8E9",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F0FF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#C8A8E9",
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#C8A8E9",
  },
  profileDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A1A5C",
    fontFamily: "System",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
    fontFamily: "System",
  },
  editButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#9b59b6",
    borderRadius: 20,
    shadowColor: "#9b59b6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "System",
    fontWeight: "500",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A1A5C",
    marginBottom: 15,
    fontFamily: "System",
    paddingLeft: 5,
  },
  settingsFrame: {
    backgroundColor: "#F5F0FF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#C8A8E9",
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(200, 168, 233, 0.2)",
    minHeight: 60,
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(200, 168, 233, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingText: {
    fontSize: 16,
    color: "#4A1A5C",
    fontFamily: "System",
    fontWeight: "500",
    flex: 1,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "System",
    marginRight: 8,
  },
  arrow: {
    fontSize: 18,
    color: "#9b59b6",
    fontWeight: "300",
  },
});

export default Settings;
