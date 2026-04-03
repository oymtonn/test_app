import "@/global.css";
import { ClerkProvider, useUser } from "@clerk/expo";
import { buildRouteUrl, identifyUser } from "@/lib/analytics";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { PostHogProvider, usePostHog } from "posthog-react-native";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function AnalyticsBridge() {
  const posthog = usePostHog();
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    if (!isLoaded || !user?.id) {
      return;
    }

    identifyUser(posthog, {
      distinctId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      name:
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        null,
      username: user.username ?? null,
    });
  }, [isLoaded, posthog, user]);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const routeUrl = buildRouteUrl(
      pathname,
      Object.fromEntries(
        Object.entries(params).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(",") : value,
        ]),
      ),
    );

    posthog.screen(pathname, {
      route_url: routeUrl,
    });
    void posthog.flush();
  }, [params, pathname, posthog]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PostHogProvider
      debug={__DEV__}
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_KEY ?? ""}
      options={{
        host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 1000,
      }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <AnalyticsBridge />
        <Stack screenOptions={{ headerShown: false }} />
      </ClerkProvider>
    </PostHogProvider>
  );
}
