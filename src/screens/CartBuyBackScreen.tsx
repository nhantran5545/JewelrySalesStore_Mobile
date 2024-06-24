import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme, useFocusEffect, useNavigation } from "@react-navigation/native";
import { Feather, Fontisto } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigators/RootNavigator';
import { getCartBuyBack, removeFromCartBuyBack, clearCartBuyBack } from '../utils/cartBuyBack';
import { fetchProductById } from '../api/api';

type Product = {
  productId: string;
  productName: string;
  description: string;
  price: number;
  productImage: string;
  productCode: string;
  material: string;
  quantity: number;
  productPrice?: number;
  buyBackPrice?: number;
  discountRate?: number;
  finalBuyBackPrice: number;
};

const CartBuyBackScreen: React.FC = () => {
  const [cartBuyBackItems, setCartBuyBackItems] = useState<Product[]>([]);
  const { colors } = useTheme();
  const navigation = useNavigation<RootStackScreenProps<'CartBuyBack'>['navigation']>();

  useFocusEffect(
    useCallback(() => {
      const fetchCartItems = async () => {
        const items = await getCartBuyBack();
        const updatedItems = await Promise.all(items.map(async (item: Product) => {
          try {
            const details = await fetchProductById(item.productId);
            const productPrice = details.productPrice;
            const buyBackPrice = details.buyBackPrice;
            const discountRate = details.discountRate;

            // Calculate the final buy-back price
            const priceDifference = productPrice - buyBackPrice;
            const discountAmount = (priceDifference * discountRate) / 100;
            const finalBuyBackPrice = buyBackPrice + discountAmount;

            return {
              ...item,
              productPrice,
              buyBackPrice,
              discountRate,
              finalBuyBackPrice,
            };
          } catch (error) {
            console.error(`Failed to fetch details for product ${item.productId}`, error);
            return item;
          }
        }));
        setCartBuyBackItems(updatedItems);
      };

      fetchCartItems();
    }, [])
  );

  const handleRemoveFromCart = (productId: string) => {
    Alert.alert(
      'Xóa khỏi giỏ hàng',
      'Bạn có muốn xóa sản phẩm này khỏi giỏ hàng',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            await removeFromCartBuyBack(productId);
            const updatedCartItems = cartBuyBackItems.filter(item => item.productId !== productId);
            setCartBuyBackItems(updatedCartItems);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleClearCart = async () => {
    Alert.alert(
      'Xóa tất cả sản phẩm',
      'Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Xóa Tất Cả',
          onPress: async () => {
            await clearCartBuyBack();
            setCartBuyBackItems([]);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Details", {id: item.productId})}>
        <Image source={{ uri: item.productImage }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.productName}</Text>
          <Text style={styles.productId}>{item.productId}</Text>
          <Text style={styles.price}>Giá đơn hàng: {item.price.toLocaleString()} VND</Text>
          <Text style={styles.price}>Giá mua lại: {item.buyBackPrice?.toLocaleString()} VND</Text>
          <Text style={styles.price}>Chiết khấu: {item.discountRate}%</Text>
          <Text style={styles.price}>Giá: {item.finalBuyBackPrice?.toLocaleString()} VND</Text>
          <Text style={styles.quantity}>Số Lượng: {item.quantity}</Text>
        </View>
        <TouchableOpacity onPress={() => handleRemoveFromCart(item.productId)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>
            <Feather name="trash-2" size={24} color="white" />
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
  );

  const getTotalPrice = () => {
    return cartBuyBackItems.reduce((total, item) => total + item.finalBuyBackPrice * item.quantity, 0).toLocaleString();
  };

  return (
    <View style={styles.container}>
      {cartBuyBackItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Fontisto name="shopping-basket" size={64} color="#888888" />
          <Text style={styles.emptyText}>Không có sản phẩm nào trong giỏ hàng</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartBuyBackItems}
            renderItem={renderItem}
            keyExtractor={item => item.productId}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.footer}>
            <Text style={styles.totalPrice}>Tổng Giá: {getTotalPrice()} VND</Text>
            <View style={styles.footerButtons}>
              <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
                <Text style={styles.clearButtonText}>Xóa Tất Cả</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate("ChooseCustomer")}>
                <Text style={styles.checkoutButtonText}>Bước Tiếp Theo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  name: {
    width: 140,
    fontSize: 16,
    fontWeight: 'bold',
  },
  productId: {
    fontSize: 14,
    color: '#888888',
  },
  price: {
    width: 220,
    fontSize: 16,
    color: '#888888',
  },
  removeButton: {
    position: 'absolute',
    right: 2,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  quantity: {
    fontSize: 14,
    color: '#888888',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  checkoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: '#888888',
  },
});

export default CartBuyBackScreen;
