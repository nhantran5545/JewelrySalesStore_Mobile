import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { RootStackScreenProps } from "../navigators/RootNavigator";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";
import BottomSheetDetail from "../components/BottomSheetDetail";
import { fetchProductById } from "../api/api";

// Định nghĩa kiểu dữ liệu Product
type Product = {
  productId: string;
  productName: string;
  size: string;
  img: string;
  counterId: number;
  counterName: string;
  categoryId: number;
  categoryName: string;
  materialCost: number;
  diamondCost: number;
  productionCost: number;
  productPrice: number;
  quantity: number;
  status: string;
};

const DetailsScreen = ({
  navigation,
  route: {
    params: { id },
  },
}: RootStackScreenProps<"Details">) => {
  console.log(id);

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const productData = await fetchProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    getProductDetails();
  }, [id]);

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{
          uri: product.img
        }}
        style={{ flex: 1 }}
      />

      <SafeAreaView
        edges={["top"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      >
        <StatusBar style="light" />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 52,
              aspectRatio: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 52,
              borderWidth: 1,
              borderColor: "#000000",
            }}
          >
            <Icons name="arrow-back" size={24} color={"#000000"} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          {/* <TouchableOpacity
            style={{
              width: 52,
              aspectRatio: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 52,
              borderWidth: 1,
              borderColor: "#000000",
            }}
          >
            <Icons name="add-shopping-cart" size={24} color={"#000000"} />
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>

      <BottomSheetDetail product={product}/>
    </View>
  );
};

export default DetailsScreen;
