import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

const SignIn = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">Sign in here</Text>
      <Link href="/(auth)/sign-up">Or Create Account</Link>
    </View>
  );
};

export default SignIn;
