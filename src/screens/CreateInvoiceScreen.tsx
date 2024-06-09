import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/RootNavigator';
import { getCart } from '../utils/cartUtil';
import { FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createInvoice } from '../api/api';

type CreateInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvoice'>;

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const tierIcons: { [key: string]: JSX.Element } = {
  "Hạng Kim Cương": <FontAwesome name="diamond" size={24} color="#16a0bc" />,
  "Hạng Bạc": <MaterialCommunityIcons name="gold" size={24} color="#b6b1b1" />,
  "Hạng Vàng": <MaterialCommunityIcons name="gold" size={24} color="#ecec58" />,
};

const CreateInvoiceScreen: React.FC = () => {
  const route = useRoute<CreateInvoiceScreenRouteProp>();
  const customer = route.params.customer;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCart();
      setCartItems(items);
    };
    fetchCartItems();
  }, []);

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const getTotalPrice = () => {
    const totalPrice = calculateTotalPrice();
    const discount = (totalPrice * customer.discountPercent) / 100;
    const discountedPrice = totalPrice - discount;
    return {
      totalPrice: totalPrice.toLocaleString(),
      discountedPrice: discountedPrice.toLocaleString(),
      discount: discount.toLocaleString()
    };
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Giá: {item.price.toLocaleString()} VND</Text>
        <Text style={styles.itemQuantity}>Số Lượng: {item.quantity}</Text>
      </View>
    </View>
  );

  const handleCreateInvoice = async () => {
    try {

      const invoice = {
        customerId: customer.customerId,
        invidualPromotionDiscount: 0,
        promotionReason: "string",
        orderSellDetails: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const response = await createInvoice(invoice);

      Alert.alert('Success', 'Invoice Created Successfully');
      // Clear the cart or navigate to another screen if needed
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating invoice');
    }

  };

  const { totalPrice, discountedPrice, discount } = getTotalPrice();

  return (
    <View style={styles.container}>
      <View style={styles.customerInfo}>
        <View style={styles.titleCustomerContainer}>
          <Text style={styles.titleCustomer}>Thông Tin Khách Hàng</Text>
          <Text style={styles.iconRank}>
            {customer.tierName && tierIcons[customer.tierName]}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerPhone}>{customer.phone}</Text>
        </View>
        <Text style={styles.customerAddress}>{customer.address}</Text>
      </View>
      {/* Display cart products here */}
      <View style={styles.cartContainer}>
        <Text style={styles.sectionTitle}>
          <FontAwesome name="shopping-bag" size={24} color="#FF6347" /> Giỏ Hàng
        </Text>
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      {/* Display promotions and final price here */}
      <View style={styles.promotionContainer}>
        <Text style={styles.sectionTitle}><Fontisto name="shopping-sale" size={24} color="#FF6347" /> Khuyến Mãi: {customer.discountPercent}%</Text>
        <Text style={styles.price}>Tổng Giá: {totalPrice} VND</Text>
        <Text style={styles.discount}>Giảm giá: {discount} VND</Text>
        <Text style={styles.finalPrice}>Giá phải thanh toán: {discountedPrice} VND</Text>
        <TouchableOpacity style={styles.button} onPress={handleCreateInvoice}>
          <Text style={styles.buttonText}>Tạo Hóa Đơn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  titleCustomer: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  customerInfo: {
    marginBottom: 15,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  titleCustomerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  iconRank: {
    position: 'absolute',
    right: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  customerPhone: {
    fontSize: 18,
    color: '#666',
  },
  customerAddress: {
    fontSize: 18,
    marginTop: 8,
    textAlign: 'center'
  },
  infoText: {
    fontSize: 18,
    marginBottom: 8,
  },
  itemInfo: {
    marginLeft: 10,
    flexShrink: 1,
  },
  itemQuantity: {
    fontSize: 16,
    marginLeft: 10,
  },
  cartContainer: {
    flex: 1,
    marginBottom: 15,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FF6347'
  },
  promotionContainer: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  finalPrice: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: "#FF6347"
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
    width: '80%'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  listContainer: {
    paddingVertical: 10,
  },
  cartItem: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333'
  },
  itemPrice: {
    fontSize: 16,
    marginLeft: 10,
    color: '#666'
  },
  discount: {
    fontSize: 16,
    color: '#666'
  }
});

export default CreateInvoiceScreen;
