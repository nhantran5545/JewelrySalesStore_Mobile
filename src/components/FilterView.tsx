import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { ReactNode, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icons from "@expo/vector-icons/MaterialIcons";
import PriceRangeSelector from "./PriceRangeSelector";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const MAX_PRICE = 500;

const TYPES = [
  {
    label: "Necklaces",
  },
  {
    label: "Rings",
  },
  {
    label: "Bracelets",
  },
  {
    label: "Earrings",
  },
  {
    label: "Anklets",
  },
  {
    label: "Charms",
  },
];

const MATERIALS = [
  {
    id: "gold",
    label: "Gold",
  },
  {
    id: "silver",
    label: "Silver",
  },
  {
    id: "platinum",
    label: "Platinum",
  },
  {
    id: "stainlessSteel",
    label: "Stainless Steel",
  },
  {
    id: "leather",
    label: "Leather",
  },
  {
    id: "wood",
    label: "Wood",
  },
];

const FilterView = () => {
  const [startPrice, setStartPrice] = useState(50);
  const [endPrice, setEndPrice] = useState(250);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number | null>(null);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState<number | null>(null);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <BottomSheetScrollView style={{ flex: 1 }}>
        <View style={{ paddingVertical: 24, gap: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 24,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                fontWeight: "700",
                color: theme.colors.text,
              }}
            >
              Filters
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  color: theme.colors.text,
                  opacity: 0.5,
                }}
              >
                Reset
              </Text>
            </TouchableOpacity>
          </View>

          {/* Range Selector */}

          <PriceRangeSelector
            minPrice={0}
            maxPrice={MAX_PRICE}
            startPrice={startPrice}
            endPrice={endPrice}
            onStartPriceChange={setStartPrice}
            onEndPriceChange={setEndPrice}
          />
          {/* Type Filter */}
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
              Type
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {TYPES.map((item, i) => (
                <Chip
                  key={i}
                  label={item.label}
                  isSelected={i === selectedTypeIndex}
                  onPress={() => setSelectedTypeIndex(i)}
                />
              ))}
            </View>
          </View>
          {/* Material Filter */}
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
            Material
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              {MATERIALS.map((item, i) => (
                <Chip
                  key={i}
                  label={item.label}
                  isSelected={i === selectedMaterialIndex}
                  onPress={() => setSelectedMaterialIndex(i)}
                />
              ))}
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
      {/* Button */}

      <View
        style={{
          padding: 24,
          paddingBottom: 24 + insets.bottom,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primary,
            height: 64,
            borderRadius: 64,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: theme.colors.background,
            }}
          >
            Apply filters
          </Text>

          <View
            style={{
              backgroundColor: theme.colors.card,
              width: 40,
              aspectRatio: 1,
              borderRadius: 40,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 12,
              right: 12,
              bottom: 12,
            }}
          >
            <Icons name="arrow-forward" size={24} color={theme.colors.text} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterView;

const Chip = ({
  isSelected,
  label,
  left,
  onPress,
}: {
  isSelected: boolean;
  label: string;
  left?: ReactNode;
  onPress: () => void;
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 100,
        backgroundColor: isSelected
          ? theme.colors.text
          : theme.colors.background,
        flexDirection: "row",
        alignItems: "center",
        margin: 4, 
      }}
    >
      {left}
      <Text
        style={{
          fontSize: 14,
          color: isSelected ? theme.colors.background : theme.colors.text,
          marginLeft: left ? 8 : 0,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
