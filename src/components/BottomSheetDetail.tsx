import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import Icons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";

// Define the Product type if not already defined
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

// Define the BottomSheetDetailProps interface
interface BottomSheetDetailProps {
  product: Product;
}

const BottomSheetDetail = ({ product }: BottomSheetDetailProps) => {
  const { colors } = useTheme();
  const [count, setCount] = useState(1);

  const handleAddToCart = async () => {
    // await addToCart(product);
    // alert('Sản Phẩm đã thêm vào giỏ hàng');
  };

  return (
    <BottomSheet
      detached
      snapPoints={[64, 500]}
      index={0}
      style={{ marginHorizontal: 20 }}
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
          {product.productName}
        </Text>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
              Mã sản phẩm:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "400", color: colors.text, opacity: 0.75, marginLeft: 8 }}>
              {product.productId}
            </Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6, color: colors.text }}>
            Kích thước:
          </Text>
          <Text style={{ color: 'white', paddingLeft: 5, marginBottom: 6, fontSize: 20, backgroundColor: 'black' }} numberOfLines={7}>
            {product.size}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
              Loại:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "400", color: colors.text, opacity: 0.75, marginLeft: 8 }}>
              {product.categoryName}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
              Giá sản xuất:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "400", color: colors.text, opacity: 0.75, marginLeft: 8 }}>
              {product.productionCost ? product.productionCost.toLocaleString() : 'N/A'} VND
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
              Giá vật liệu:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "400", color: colors.text, opacity: 0.75, marginLeft: 8 }}>
              {product.materialCost ? product.materialCost.toLocaleString() : 'N/A'} VND
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
              Giá kim cương:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "400", color: colors.text, opacity: 0.75, marginLeft: 8 }}>
              {product.diamondCost ? product.diamondCost.toLocaleString() : 'N/A'} VND
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
              Trạng thái:
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "400", color: colors.text, opacity: 0.75, marginLeft: 8 }}>
              {product.status}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, opacity: 0.75, marginBottom: 4 }}>
              Giá
            </Text>
            <Text style={{ color: '#A2765B', fontSize: 18, fontWeight: "600", width: 400 }}>
              {product.productPrice ? product.productPrice.toLocaleString() : 'N/A'} VND
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
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.background, paddingHorizontal: 8 }}>
              Add to cart
            </Text>
            <View style={{ backgroundColor: colors.card, width: 30, aspectRatio: 1, borderRadius: 40, alignItems: "center", justifyContent: "center" }}>
              <Icons name="arrow-forward" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

export default BottomSheetDetail;
