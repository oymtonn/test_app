import "@/global.css";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView); // safearea view from the npm is a third party component and native wind needs styled wrapper to work with it

const Settings = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">Settings</Text>
    </SafeAreaView>
  );
};

export default Settings;
