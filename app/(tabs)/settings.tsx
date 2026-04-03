import "@/global.css";
import { useClerk, useUser } from "@clerk/expo";
import { components } from "@/constants/theme";
import images from "@/constants/images";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import {
  SafeAreaView as RNSafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView); // safearea view from the npm is a third party component and native wind needs styled wrapper to work with it

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const insets = useSafeAreaInsets();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const tabBar = components.tabBar;
  const bottomPadding =
    tabBar.height + tabBar.horizontalInset * 2 + Math.max(insets.bottom, 16);
  const userName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Account";
  const joinedDate = user?.createdAt
    ? dayjs(user.createdAt).format("MMMM D, YYYY")
    : "Unavailable";
  const avatarSource = user?.imageUrl
    ? { uri: user.imageUrl }
    : images.avatar;

  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="settings-safe-area">
      <View className="settings-screen" style={{ paddingBottom: bottomPadding }}>
        <View className="settings-stack">
          <View>
            <Text className="settings-title">Settings</Text>
            <Text className="settings-subtitle">
              Review your account details and sign out to retest the auth flow.
            </Text>
          </View>

          <View className="settings-profile-card">
            <View className="settings-profile-row">
              <Image source={avatarSource} className="settings-avatar" />
              <View className="flex-1">
                <Text className="settings-name">{userName}</Text>
                <Text className="settings-email">
                  {user?.primaryEmailAddress?.emailAddress ?? "No email found"}
                </Text>
              </View>
            </View>
          </View>

          <View className="settings-info-card">
            <View className="settings-info-row">
              <Text className="settings-info-label">Joined</Text>
              <Text className="settings-info-value">{joinedDate}</Text>
            </View>
            <View className="settings-info-divider" />
            <View className="settings-info-row">
              <Text className="settings-info-label">User ID</Text>
              <Text className="settings-info-value">{user?.id ?? "Unavailable"}</Text>
            </View>
          </View>

          <Pressable
            className={`settings-logout-button ${isSigningOut ? "settings-logout-button-disabled" : ""}`}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            <Text className="settings-logout-text">
              {isSigningOut ? "Logging out..." : "Log out"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
