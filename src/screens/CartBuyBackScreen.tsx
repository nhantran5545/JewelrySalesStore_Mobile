import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme, useFocusEffect, useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigators/RootNavigator';
import { Fontisto } from '@expo/vector-icons';
import { getCartBuyBack, removeFromCartBuyBack } from '../utils/cartBuyBack';
import { calculateBuyBackPrice } from '../api/api';

type Product = {
  productId: string;
  productName: string;
  description: string;
  price: number;
  productImage: string;
  productCode: string;
  material: string;
  quantity: number;
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
          const price = await calculateBuyBackPrice(item.productId);
          return { ...item, price };
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

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.productImage }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.productName}</Text>
        <Text style={styles.productId}>{item.productId}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} VND</Text>
        <Text style={styles.quantity}>Số Lượng: {item.quantity}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveFromCart(item.productId)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>
          <Feather name="trash-2" size={24} color="white" />
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getTotalPrice = () => {
    return cartBuyBackItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString();
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
            <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate("ChooseCustomer")}>
              <Text style={styles.checkoutButtonText}>Bước Tiếp Theo</Text>
            </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  productId: {
    fontSize: 14,
    color: '#888888',
  },
  price: {
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
  },
  checkoutButtonText: {
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
