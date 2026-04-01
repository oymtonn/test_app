import "@/global.css";
import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

// a page for each subscription depending on the subscription id. same stuff on the page, just variable changes

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Subscription Details: {id}
      </Text>
      <Link href="/">Go Back</Link>
    </View>
  );
};

export default SubscriptionDetails;
