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
import { addToCart } from "../utils/cartUtil";

// Định nghĩa kiểu dữ liệu Product (nếu chưa được định nghĩa ở đây)
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  productCode: String;
  material: String;
  color: String;
  style: String;
  weight: String;
  length: String;
};

// Định nghĩa kiểu props cho BottomSheetDetail
interface BottomSheetDetailProps {
  product: Product;
}

// const SIZES = ["5", "5.5", "6", "7.5", "8", "8.5", "9", "9.5", "10", "10.5"];

const BottomSheetDetail = ({ product }: BottomSheetDetailProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(1);
  // const [size, setSize] = useState(SIZES[0]);

  const handleAddToCart = async () => {
    await addToCart(product);
    alert('Sản Phẩm đã thêm vào giỏ hàng');
  };

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
          {product.name}
        </Text>
        {/* <View>
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
        </View> */}

        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Mã sản phẩm:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: colors.text,
                opacity: 0.75,
                marginLeft: 8,
              }}
            >
              {product.productCode}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 6,
              color: colors.text,
            }}
          >
            Mô tả
          </Text>
          <Text style={{ color: colors.text, opacity: 0.75, marginBottom: 6 }} numberOfLines={7}>
            {product.description}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Chất liệu:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: colors.text,
                opacity: 0.75,
                marginLeft: 8,
              }}
            >
              {product.material}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Màu sắc:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: colors.text,
                opacity: 0.75,
                marginLeft: 8,
              }}
            >
              {product.color}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Kiểu dáng:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: colors.text,
                opacity: 0.75,
                marginLeft: 8,
              }}
            >
              {product.style}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Trọng Lượng:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: colors.text,
                opacity: 0.75,
                marginLeft: 8,
              }}
            >
              {product.weight}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Chiều dài:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: colors.text,
                opacity: 0.75,
                marginLeft: 8,
              }}
            >
              {product.length}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: colors.text, opacity: 0.75, marginBottom: 4 }}
            >
              Giá
            </Text>
            <Text
              style={{ color: '#A2765B', fontSize: 18, fontWeight: "600" }}
            >
              {product.price.toLocaleString()} VND
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
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
