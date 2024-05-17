import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { RootStackScreenProps } from "../navigators/RootNavigator";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import BottomSheet from "@gorhom/bottom-sheet";

const SIZES = ["5", "5.5", "6", "7.5", "8", "8.5", "9", "9.5", "10", "10.5"];

const BottomSheetDetail = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(1);
  const [size, setSize] = useState(SIZES[0]);

  return (
    <BottomSheet
      detached
      snapPoints={[64, 500]}
      index={0}
      style={{ marginHorizontal: 20 }}
      bottomInset={insets.bottom + 20}
      backgroundStyle={{
        borderRadius: 24,
        backgroundColor: colors.background,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.primary,
      }}
    >
      <View style={{ padding: 16, gap: 16, flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: "600", color: colors.text }}>
          Ổ NHẪN NỮ KIM CƯƠNG ĐÀI HOA
        </Text>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: colors.text, opacity: 0.5 }}>Size</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 6,
              marginTop: 6,
            }}
          >
            {SIZES.map((s, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSize(s)}
                style={{
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: s === size ? colors.primary : colors.card,
                  borderRadius: 44,
                }}
              >
                <Text
                  style={{
                    color: s === size ? colors.card : colors.text,
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 6,
              color: colors.text,
            }}
          >
            Description
          </Text>
          <Text style={{ color: colors.text, opacity: 0.75 }} numberOfLines={7}>
            Diamonds are inherently a piece of jewelry that brings pride and
            endless fashion inspiration. Owning your own diamond jewelry is what
            everyone desires. The ring is crafted from 14K gold and accented
            with diamonds with 57 precisely cut facets, creating jewelry full of
            luxury and class.
          </Text>
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: colors.text, opacity: 0.75, marginBottom: 4 }}
            >
              Total
            </Text>
            <Text
              style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}
            >
              ${(25000).toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              height: 64,
              borderRadius: 64,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              flexDirection: "row",
              padding: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.background,
                paddingHorizontal: 16,
              }}
            >
              Add to cart
            </Text>

            <View
              style={{
                backgroundColor: colors.card,
                width: 40,
                aspectRatio: 1,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons name="arrow-forward" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};
export default BottomSheetDetail;
