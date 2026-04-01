import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

const SignUp = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">Sign Up Here</Text>
      <Link href="/(auth)/sign-in">Or Sign In</Link>
    </View>
  );
};

export default SignUp;
