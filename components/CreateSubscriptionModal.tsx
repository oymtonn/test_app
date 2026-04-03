import "@/global.css";
import { icons } from "@/constants/icons";
import dayjs from "dayjs";
import { clsx } from "clsx";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const FREQUENCY_OPTIONS = ["Monthly", "Yearly"] as const;
const CATEGORY_OPTIONS = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const CATEGORY_COLORS: Record<(typeof CATEGORY_OPTIONS)[number], string> = {
  Entertainment: "#F4D06F",
  "AI Tools": "#B8D4E3",
  "Developer Tools": "#A7D8C9",
  Design: "#F3C58D",
  Productivity: "#D8C7F7",
  Cloud: "#B8E0F6",
  Music: "#FFD6A5",
  Other: "#D8E2DC",
};

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
};

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] =
    useState<(typeof FREQUENCY_OPTIONS)[number]>("Monthly");
  const [category, setCategory] =
    useState<(typeof CATEGORY_OPTIONS)[number]>("Entertainment");
  const [error, setError] = useState("");

  const trimmedName = name.trim();
  const parsedPrice = Number(price);
  const isFormValid =
    trimmedName.length > 0 && Number.isFinite(parsedPrice) && parsedPrice > 0;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!trimmedName) {
      setError("Please enter a subscription name.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Please enter a valid positive price.");
      return;
    }

    const startDate = dayjs();
    const renewalDate =
      frequency === "Monthly" ? startDate.add(1, "month") : startDate.add(1, "year");

    onCreate({
      id: `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: trimmedName,
      price: Number(parsedPrice.toFixed(2)),
      icon: icons.wallet,
      plan: `${frequency} Plan`,
      category,
      paymentMethod: "Added manually",
      status: "active",
      startDate: startDate.toISOString(),
      renewalDate: renewalDate.toISOString(),
      currency: "USD",
      billing: frequency,
      color: CATEGORY_COLORS[category],
    });

    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable className="modal-overlay" onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-end"
        >
          <Pressable className="modal-container" onPress={(event) => event.stopPropagation()}>
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">x</Text>
              </Pressable>
            </View>

            <ScrollView
              className="max-h-[75%]"
              contentContainerClassName="modal-body"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Spotify"
                  placeholderTextColor="rgba(0, 0, 0, 0.45)"
                  className="auth-input"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  value={price}
                  onChangeText={(value) => {
                    setPrice(value);
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="9.99"
                  placeholderTextColor="rgba(0, 0, 0, 0.45)"
                  keyboardType="decimal-pad"
                  className="auth-input"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {FREQUENCY_OPTIONS.map((option) => {
                    const isActive = frequency === option;

                    return (
                      <Pressable
                        key={option}
                        className={clsx("picker-option", isActive && "picker-option-active")}
                        onPress={() => setFrequency(option)}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            isActive && "picker-option-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORY_OPTIONS.map((option) => {
                    const isActive = category === option;

                    return (
                      <Pressable
                        key={option}
                        className={clsx("category-chip", isActive && "category-chip-active")}
                        onPress={() => setCategory(option)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            isActive && "category-chip-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {error ? <Text className="auth-error">{error}</Text> : null}

              <Pressable
                className={clsx("auth-button", !isFormValid && "auth-button-disabled")}
                onPress={handleSubmit}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default CreateSubscriptionModal;
