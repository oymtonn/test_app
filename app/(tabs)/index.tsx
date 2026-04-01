import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView); // safearea view from the npm is a third party component and native wind needs styled wrapper to work with it

// home page '/'

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Go to Onboarding
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Go to Sign In
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Go to Sign Up
      </Link>
      {/* dynamic linking */}
      <Link
        href={{ pathname: "/subscriptions/[id]", params: { id: "spotify" } }}
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Spotify Subscription
      </Link>
      <Link
        href={{ pathname: "/subscriptions/[id]", params: { id: "claude" } }}
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Claude Max Subscription
      </Link>
    </SafeAreaView>
  );
}
