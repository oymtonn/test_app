import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });

    if (error) {
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http") && typeof window !== "undefined") {
            window.location.href = url;
          } else {
            router.replace(url as Href);
          }
        },
      });
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.container}>
          <Text style={styles.title}>Verify your account</Text>
          <TextInput
            style={styles.input}
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor="#6B7A94"
            onChangeText={setCode}
            keyboardType="numeric"
          />
          {errors.fields.code && (
            <Text style={styles.error}>{errors.fields.code.message}</Text>
          )}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              fetchStatus === "fetching" && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleVerify}
            disabled={fetchStatus === "fetching"}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.ghostButton, pressed && styles.buttonPressed]}
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text style={styles.secondaryButtonText}>I need a new code</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>R</Text>
          </View>
          <View>
            <Text style={styles.brandName}>Recurly</Text>
            <Text style={styles.brandSub}>SMART BILLING</Text>
          </View>
        </View>

        <View style={styles.headerBlock}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start managing your subscriptions in one place</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter your email"
            placeholderTextColor="#6B7A94"
            onChangeText={setEmailAddress}
            keyboardType="email-address"
          />
          {errors.fields.emailAddress && (
            <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter your password"
            placeholderTextColor="#6B7A94"
            secureTextEntry
            onChangeText={setPassword}
          />
          {errors.fields.password && (
            <Text style={styles.error}>{errors.fields.password.message}</Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              (!emailAddress || !password || fetchStatus === "fetching") &&
                styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            <Text style={styles.buttonText}>Create account</Text>
          </Pressable>

          <View style={styles.linkContainer}>
            <Text style={styles.linkCopy}>Already have an account? </Text>
            <Link href="/(auth)/sign-in" style={styles.link}>
              Sign in
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3EED9",
  },
  container: {
    flex: 1,
    paddingTop: 78,
    paddingHorizontal: 14,
    gap: 28,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#E7794D",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
    marginTop: -1,
  },
  brandName: {
    fontSize: 35,
    lineHeight: 37,
    color: "#17233A",
    fontWeight: "700",
  },
  brandSub: {
    marginTop: 2,
    color: "#5D6F8D",
    fontSize: 12,
    letterSpacing: 0.2,
  },
  headerBlock: {
    alignItems: "center",
    gap: 8,
    marginTop: 22,
  },
  formCard: {
    borderWidth: 1,
    borderColor: "#DDD3BE",
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  title: {
    fontSize: 39 / 2,
    fontWeight: "700",
    color: "#17233A",
  },
  subtitle: {
    fontSize: 14 / 1.05,
    color: "#536785",
  },
  label: {
    fontWeight: "700",
    fontSize: 14,
    color: "#17233A",
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CFC4AC",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    backgroundColor: "#F6F0DE",
    color: "#17233A",
  },
  button: {
    backgroundColor: "#E7794D",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.86,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  ghostButton: {
    marginTop: 2,
    alignItems: "center",
    paddingVertical: 6,
  },
  secondaryButtonText: {
    color: "#E7794D",
    fontWeight: "700",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  linkCopy: {
    color: "#536785",
    fontSize: 14,
  },
  link: {
    color: "#E7794D",
    fontWeight: "700",
  },
  error: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: -2,
  },
});
