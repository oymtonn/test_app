import type { PostHog } from "posthog-react-native";

export const AnalyticsEvent = {
  UserSignedIn: "user_signed_in",
  UserSignInFailed: "user_sign_in_failed",
  UserSignedUp: "user_signed_up",
  UserSignUpFailed: "user_sign_up_failed",
  UserSignedOut: "user_signed_out",
  SubscriptionExpanded: "subscription_expanded",
  SubscriptionCollapsed: "subscription_collapsed",
  SubscriptionDetailsViewed: "subscription_details_viewed",
} as const;

type AnalyticsEventName =
  (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

type IdentifyUserOptions = {
  distinctId: string;
  email?: string | null;
  name?: string | null;
  username?: string | null;
};

export function buildRouteUrl(
  pathname: string,
  params?: Record<string, string | number | boolean | null | undefined>,
) {
  const entries = Object.entries(params ?? {}).filter(([, value]) => value !== undefined);

  if (!entries.length) {
    return pathname;
  }

  const query = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value ?? ""))}`)
    .join("&");

  return `${pathname}?${query}`;
}

export function identifyUser(posthog: PostHog | null | undefined, user: IdentifyUserOptions) {
  if (!posthog) {
    return;
  }

  posthog.identify(user.distinctId, {
    email: user.email ?? undefined,
    name: user.name ?? undefined,
    username: user.username ?? undefined,
  });
}

export function resetUser(posthog: PostHog | null | undefined) {
  if (!posthog) {
    return;
  }

  posthog.reset();
}

export function captureEvent(
  posthog: PostHog | null | undefined,
  event: AnalyticsEventName,
  properties?: AnalyticsProperties,
) {
  if (!posthog) {
    return;
  }

  posthog.capture(event, properties);
  void posthog.flush();
}
