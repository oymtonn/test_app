import "@/global.css";
import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { components } from "@/constants/theme";
import { styled } from "nativewind";
import React, { useDeferredValue, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView); // safearea view from the npm is a third party component and native wind needs styled wrapper to work with it

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const insets = useSafeAreaInsets();
  const tabBar = components.tabBar;
  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();
  const bottomPadding =
    tabBar.height + tabBar.horizontalInset * 2 + Math.max(insets.bottom, 16);

  const filteredSubscriptions = HOME_SUBSCRIPTIONS.filter((subscription) => {
    if (!normalizedQuery) {
      return true;
    }

    return [
      subscription.name,
      subscription.plan,
      subscription.category,
      subscription.billing,
      subscription.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  return (
    <SafeAreaView className="subscriptions-safe-area" edges={["top"]}>
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 12) + 8,
          paddingBottom: bottomPadding,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="subscriptions-header">
            <View>
              <Text className="subscriptions-title">My Subscriptions</Text>
              <Text className="subscriptions-subtitle">
                Search across your current plans and tap a card to see more details.
              </Text>
            </View>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name, plan, or category"
              placeholderTextColor="rgba(8, 17, 38, 0.45)"
              className="subscriptions-search-input"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <View className="subscriptions-empty">
            <Text className="subscriptions-empty-title">No subscriptions found</Text>
            <Text className="subscriptions-empty-copy">
              Try a different search term like &quot;design&quot;, &quot;monthly&quot;, or a subscription name.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
