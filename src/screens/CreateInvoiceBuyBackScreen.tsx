import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigators/RootNavigator';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { createBuyBackInvoice } from '../api/api';

type CreateInvoiceBuyBackScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvoice'>;

interface CartItem {
  id: string;
  productType: string;
  goldType: string;
  diamondType?: string;
  jewelryType?: string;
  price: number;
  materialId: string;
  gram: number;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  material: string;
  origin: string;
}

const tierIcons: { [key: string]: JSX.Element } = {
  "Hạng Kim Cương": <FontAwesome name="diamond" size={24} color="#16a0bc" />,
  "Hạng Bạc": <MaterialIcons name="stars" size={24} color="#ada7a7" />,
  "Hạng Vàng": <MaterialIcons name="stars" size={24} color="#fcf302" />,
  "Hạng Đồng": <MaterialIcons name="stars" size={24} color="#726b055b" />
};

const CreateInvoiceBuyBackScreen: React.FC = () => {
  const route = useRoute<CreateInvoiceBuyBackScreenRouteProp>();
  const navigation = useNavigation();
  const customer = route.params.customer;
  const [products, setProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCustomerAndProducts = async () => {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
        console.log(products);
      }
    };

    fetchCustomerAndProducts();
  }, []);

  const calculateTotalPrice = () => {
    return products.reduce((total, item) => total + item.price, 0);
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
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>Loại: {item.productType}</Text>
        <Text style={styles.itemName}>Tên sản phẩm: {item.jewelryType}</Text>
        {item.material && (
          <Text style={styles.productDetail}>Loại Vàng: {item.material}</Text>
        )}
        <Text style={styles.productDetail}>{item.materialId}</Text>
        {item.gram && (
          <Text style={styles.productDetail}>Gram: {item.gram} gram</Text>
        )}
        <Text style={styles.itemPrice}>Giá: {item.price.toLocaleString()} VND</Text>
      </View>
    </View>
  );

  const handleCreateInvoice = async () => {
    try {
      const buyBackDetails = products.map(product => ({
        materialId: product.materialId || null,
        quantity: 1 || null,
        weight: product.gram || null,
        origin: product.origin || '',
        caratWeight: product.carat || 0,
        color: product.color || '',
        clarity: product.clarity || '',
        cut: product.cut || ''
      }));

      const invoiceData = {
        customerId: customer.customerId,
        orderBuyBackDetails: buyBackDetails
      };

      // console.log(invoiceData);

      const response = await createBuyBackInvoice(invoiceData);

      if (response) {
        Alert.alert('Success', 'Buyback Invoice Created Successfully');
      } else {
        Alert.alert('Error', 'Failed to create buyback invoice');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating buyback invoice');
    }
  };

  const { totalPrice, discountedPrice, discount } = getTotalPrice();

  return (
    <View style={styles.container}>
      <View style={styles.customerInfo}>
        <View style={styles.titleCustomerContainer}>
          <Text style={styles.titleCustomer}>Thông Tin Khách Hàng</Text>
          <Text style={styles.iconRank}>
            {customer.tierName && (
              <>
                {customer.tierName === 'Hạng Kim Cương' && <FontAwesome name="diamond" size={24} color="#16a0bc" />}
                {customer.tierName === 'Hạng Bạc' && <MaterialIcons name="stars" size={24} color="#ada7a7" />}
                {customer.tierName === 'Hạng Vàng' && <MaterialIcons name="stars" size={24} color="#fcf302" />}
                {customer.tierName === 'Hạng Đồng' && <MaterialIcons name="stars" size={24} color="#726b055b" />}
              </>
            )}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerPhone}>{customer.phone}</Text>
        </View>
        <Text style={styles.customerAddress}>{customer.address}</Text>
      </View>
      <View style={styles.cartContainer}>
        <Text style={styles.sectionTitle}>
          <FontAwesome name="shopping-bag" size={24} color="#FF6347" /> Sản phẩm đã chọn
        </Text>
        <FlatList
          data={products}
          renderItem={renderCartItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <View style={styles.promotionContainer}>
        <View style={styles.promotionInfo}>
          <Text style={styles.price}>Tổng Giá: {totalPrice} VND</Text>
        </View>
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
    padding: 6,
    backgroundColor: '#F5F5F5',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333'
  },
  titleCustomer: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  productDetail: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  customerInfo: {
    marginBottom: 5,
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
  itemInfo: {
    marginLeft: 10,
    flexShrink: 1,
  },
  itemQuantity: {
    fontSize: 16,
    marginLeft: 10,
  },
  cartContainer: {
    height: 350,
    marginBottom: 15,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FF6347'
  },
  promotionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promotionInfo: {
    flex: 1,
    paddingRight: 10,
  },
  promotion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FF6347'
  },
  finalPrice: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: "#FF6347",
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetail: {
    fontSize: 16,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6347'
  },
  listContainer: {
    paddingBottom: 16,
  },
  discount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FF6347'
  },
});

export default CreateInvoiceBuyBackScreen;
