import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { AnalyticsEvent, buildRouteUrl, captureEvent } from "@/lib/analytics";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { useUser } from "@clerk/expo";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { usePathname } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { usePostHog } from "posthog-react-native";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView); // safearea view from the npm is a third party component and native wind needs styled wrapper to work with it
// safe area view is used to avoid notches and other screen cutouts on mobile devices, it ensures that the content is rendered within the safe area of the device's screen
// home page '/'

export default function App() {
  const { user } = useUser();
  const posthog = usePostHog();
  const pathname = usePathname();
  const [subscriptions, setSubscriptions] = useState(HOME_SUBSCRIPTIONS);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const userName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Welcome";

  const avatarSource = user?.imageUrl
    ? { uri: user.imageUrl }
    : images.avatar;

  const handleSubscriptionPress = (subscription: Subscription) => {
    setExpandedSubscriptionId((currentId) => {
      const isCollapsing = currentId === subscription.id;

      captureEvent(
        posthog,
        isCollapsing
          ? AnalyticsEvent.SubscriptionCollapsed
          : AnalyticsEvent.SubscriptionExpanded,
        {
          subscriptionId: subscription.id,
          subscriptionName: subscription.name,
          plan: subscription.plan,
          category: subscription.category,
          billing: subscription.billing,
          status: subscription.status,
          email: user?.primaryEmailAddress?.emailAddress ?? null,
          pathname,
          route_url: buildRouteUrl(pathname),
        },
      );

      return isCollapsing ? null : subscription.id;
    });
  };

  const handleCreateSubscription = (subscription: Subscription) => {
    setSubscriptions((currentSubscriptions) => [subscription, ...currentSubscriptions]);
    setExpandedSubscriptionId(subscription.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* dynamic linking 
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
      */}
      {/* header with profile pic, name, add button */}

      {/* we are passing the expanded state and onPress handler to the subscription card, when the card is pressed it 
        will toggle the expanded state and show more details about the subscription 
                <SubscriptionCard
          {...HOME_SUBSCRIPTIONS[0]}
          expanded={expandedSubscriptionId === HOME_SUBSCRIPTIONS[0].id}
          onPress={() =>
            setExpandedSubscriptionId((currentId) =>
              currentId === HOME_SUBSCRIPTIONS[0].id
                ? null
                : HOME_SUBSCRIPTIONS[0].id,
            )
          }
        />
        */}
      <FlatList
        // ListHeaderComponent is used to render the header of the list, it can be used to render any component above the list items,
        //  in this case we are using it to render the user profile, balance card and upcoming subscriptions,
        // this makes it so the whole page is scrollable and not just upcoming subscriptions
        // take everything that is above the list of subs, that also needs to scroll and just add it to the flatlist
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={avatarSource} className="home-avatar" />
                <Text className="home-user-name">{userName}</Text>
              </View>
              <Pressable onPress={() => setIsCreateModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>
            {/* balance card, cant be moved or clicked */}

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>
            {/* scrollable content area for apps */}

            <View className="mb-5">
              <ListHeading title="Upcoming" />
              {/*<UpcomingSubscriptionCard data={UPCOMING_SUBSCRIPTIONS[0]}/> Here, this is just using the component by itself not a list*/}
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard data={item} />
                )}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <Text className="home-empty-state">No active subscriptions yet.</Text>
        }
        contentContainerClassName="pb-30" // add padding to the bottom of the list to avoid content being cut off by the tab bar
        showsVerticalScrollIndicator={false}
      />
      <CreateSubscriptionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateSubscription}
      />
    </SafeAreaView>
  );
}
