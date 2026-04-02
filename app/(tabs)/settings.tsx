import "@/global.css";
import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { Pressable, Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView); // safearea view from the npm is a third party component and native wind needs styled wrapper to work with it

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">Settings</Text>
      <Text className="mt-3 text-text text-base">{user?.primaryEmailAddress?.emailAddress ?? user?.id}</Text>
      <Pressable className="mt-6 rounded-lg bg-primary px-6 py-3" onPress={() => signOut()}>
        <Text className="text-white font-sans-semibold">Sign out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
