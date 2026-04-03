import "@/global.css";
import { AnalyticsEvent, buildRouteUrl, captureEvent } from "@/lib/analytics";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { Link, useLocalSearchParams, usePathname } from "expo-router";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { usePostHog } from "posthog-react-native";
import { Text, View } from "react-native";

// a page for each subscription depending on the subscription id. same stuff on the page, just variable changes

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const posthog = usePostHog();
  const pathname = usePathname();
  const { user } = useUser();
  const subscription = HOME_SUBSCRIPTIONS.find((item) => item.id === id);

  useEffect(() => {
    if (!id) {
      return;
    }

    captureEvent(posthog, AnalyticsEvent.SubscriptionDetailsViewed, {
      subscriptionId: id,
      subscriptionName: subscription?.name ?? null,
      plan: subscription?.plan ?? null,
      category: subscription?.category ?? null,
      status: subscription?.status ?? null,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
      pathname,
      route_url: buildRouteUrl(pathname, { id }),
    });
  }, [
    id,
    pathname,
    posthog,
    subscription?.category,
    subscription?.name,
    subscription?.plan,
    subscription?.status,
    user?.primaryEmailAddress?.emailAddress,
  ]);

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
