import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

interface CartItem {
  id: string;
  productType: string;
  goldType?: string;
  goldGram?: string;
  diamondGram?: string;
  diamondType?: string;
  jewelryType?: string;
  price: number;
}

const CreateInvoiceBuyBackScreen: React.FC = () => {
  const navigation = useNavigation();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [products, setProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCustomerAndProducts = async () => {
      const storedCustomer = await AsyncStorage.getItem('customer');
      const storedProducts = await AsyncStorage.getItem('products');

      if (storedCustomer) {
        setCustomer(JSON.parse(storedCustomer));
      }
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    };

    fetchCustomerAndProducts();
  }, []);

  const calculateTotalPrice = () => {
    return products.reduce((total, item) => total + item.price, 0);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>Loại: {item.productType}</Text>
        <Text style={styles.itemName}>Tên sản phẩm: {item.jewelryType}</Text>
        {item.goldType && <Text style={styles.itemPrice}>Loại Vàng: {item.goldType}</Text>}
        {item.goldGram && <Text style={styles.itemPrice}>Gold Gram: {item.goldGram ? `${item.goldGram} gram` : ''}</Text>}
        {item.diamondType && <Text style={styles.itemPrice}>Loại Kim Cương: {item.diamondType}</Text>}
        {item.diamondGram && <Text style={styles.itemPrice}>Diamond Gram: {item.diamondGram ? `${item.diamondGram} gram` : ''}</Text>}
        <Text style={styles.itemPrice}>Giá: {item.price.toLocaleString()} VND</Text>
      </View>
    </View>
  );

  const handleCreateInvoice = async () => {
    try {
      const invoice = {
        customer,
        items: products,
        totalPrice: calculateTotalPrice(),
        date: new Date().toISOString()
      };

      const response = await fetch('http://192.10.1.26:3000/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoice)
      });

      if (response.ok) {
        Alert.alert('Success', 'Invoice Created Successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to create invoice');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating invoice');
    }
  };

  const totalPrice = calculateTotalPrice().toLocaleString();

  return (
    <View style={styles.container}>
      <View style={styles.customerInfo}>
        <Text style={styles.title}>Thông tin Khách hàng</Text>
        <Text style={styles.infoText}>Họ và tên: {customer.name}</Text>
        <Text style={styles.infoText}>Số điện thoại: {customer.phone}</Text>
        <Text style={styles.infoText}>Địa chỉ: {customer.address}</Text>
      </View>
      <View style={styles.cartContainer}>
        <Text style={styles.sectionTitle}>
          <FontAwesome name="shopping-bag" size={24} color="black" /> Sản phẩm đã chọn
        </Text>
        <FlatList
          data={products}
          renderItem={renderCartItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <Text style={styles.finalPrice}>Tổng giá: {totalPrice} VND</Text>
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
  cartContainer: {
    height: 400,
    marginBottom: 15,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#000000',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
    paddingVertical: 10,
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

export default CreateInvoiceBuyBackScreen;
