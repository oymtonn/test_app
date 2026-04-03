# PostHog Setup Report

## Status

PostHog is installed and wired into the app at a basic provider level.

- Package present: `posthog-react-native@^4.39.3`
- Provider present in `app/_layout.tsx`
- Environment variables present in `.env`

## Current Configuration

### Root provider

PostHog is initialized in `app/_layout.tsx` with:

- `apiKey={process.env.EXPO_PUBLIC_POSTHOG_KEY ?? ""}`
- `options={{ host: process.env.EXPO_PUBLIC_POSTHOG_HOST }}`

This means PostHog is available app-wide through the root provider.

### Environment variables

The following variables are currently configured in `.env`:

- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`

Because these use the `EXPO_PUBLIC_` prefix, they are client-exposed by design. That is normal for a PostHog project API key and host in a client app.

## What I Verified

- PostHog dependency exists in `package.json`
- `PostHogProvider` is imported and mounted in `app/_layout.tsx`
- PostHog env vars are present
- No explicit `capture`, `identify`, `screen`, `group`, or reset/logout tracking calls were found in the app code

## Gaps

The integration appears incomplete beyond initialization.

- No custom event capture calls found
- No user identification flow found after sign-in
- No logout/reset analytics cleanup found
- No screen tracking implementation found
- No feature flag usage found
- No dedicated analytics helper module found

## Risk Notes

- `EXPO_PUBLIC_POSTHOG_KEY` is expected to be public in a client app
- The sensitive part is not the PostHog client key itself, but accidentally committing other secrets into `.env`
- Your repo now has a safer pattern with `.env.example`, but make sure future private keys stay out of Expo client env vars unless they are intentionally public

## Recommended Next Steps

1. Add `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` to `.env.example`
2. Create a small analytics utility so events are called consistently
3. Call `identify` after Clerk authentication succeeds
4. Track key app events such as sign-in, sign-up, subscription created, subscription viewed, and settings updates
5. Add screen tracking for major routes if product analytics matter
6. Reset PostHog identity on sign-out if you support logout

## Suggested Baseline Events

- `app_opened`
- `sign_in_started`
- `sign_in_succeeded`
- `sign_up_started`
- `sign_up_succeeded`
- `subscription_viewed`
- `subscription_created`
- `subscription_updated`
- `subscription_deleted`
- `settings_opened`

## Files Reviewed

- `app/_layout.tsx`
- `.env`
- `package.json`

## Conclusion

PostHog is partially set up and should initialize successfully as long as the env vars are loaded by Expo. The app does not yet appear to be sending meaningful product analytics beyond provider initialization.
