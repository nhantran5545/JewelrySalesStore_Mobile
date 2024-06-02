import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList,Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/RootNavigator';
import { getCart } from '../utils/cartUtil';
import { FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

type CreateInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvoice'>;

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const CreateInvoiceScreen: React.FC = () => {
  const route = useRoute<CreateInvoiceScreenRouteProp>();
  const customer = route.params.customer;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
    const discount = totalPrice * 0.05; // 5% discount
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
        <Text style={styles.itemQuantity}>Số Lượng: 1</Text>
      </View>
    </View>
  );

  // const handleCreateInvoice = () => {
  //   // Handle create invoice action
  //   alert('Invoice Created');
  // };

  const handleCreateInvoice = async () => {
    try {
      const invoice = {
        customer,
        items: cartItems,
        totalPrice: calculateTotalPrice(),
        discount: calculateTotalPrice() * 0.05,
        finalPrice: calculateTotalPrice() * 0.95,
        date: new Date().toISOString()
      };

      const response = await fetch('http://10.0.128.112:3000/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoice)
      });

      if (response.ok) {
        Alert.alert('Success', 'Invoice Created Successfully');
      } else {
        Alert.alert('Error', 'Failed to create invoice');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating invoice');
    }
  };


  const { totalPrice, discountedPrice, discount } = getTotalPrice();

  return (
    <View style={styles.container}>
      <View style={styles.customerInfo}>
        <Text style={styles.title}>Thông tin Khách hàng</Text>
        <Text style={styles.infoText}>Họ và tên: {customer.name}</Text>
        <Text style={styles.infoText}>Số điện thoại: {customer.phone}</Text>
        <Text style={styles.infoText}>Địa chỉ: {customer.address}</Text>
      </View>
      {/* Display cart products here */}
      <View style={styles.cartContainer}>
        <Text style={styles.sectionTitle}>
          <FontAwesome name="shopping-bag" size={24} color="black" /> Giỏ Hàng
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
        <Text style={styles.sectionTitle}><Fontisto name="shopping-sale" size={24} color="black" /> Khuyến Mãi: 5%</Text>
        <Text style={styles.price}>Tổng Giá: {totalPrice} VND</Text>
        <Text>Giảm giá: {discount} VND</Text>
      </View>
      <Text style={styles.finalPrice}>Giá phải thanh toán: {discountedPrice} VND</Text>
      <TouchableOpacity style={styles.button} onPress={handleCreateInvoice}>
        <Text style={styles.buttonText}>Tạo Hóa Đơn</Text>
      </TouchableOpacity>
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
    marginBottom: 5
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  customerInfo: {
    marginBottom: 15,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#000000',
    borderWidth: 1,
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
    height: 200,
    marginBottom: 15,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#000000',
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
  },
  promotionContainer: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#000000',
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
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 10, // Bạn có thể tùy chỉnh các giá trị này
  },
  cartItem: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  itemPrice: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default CreateInvoiceScreen;
