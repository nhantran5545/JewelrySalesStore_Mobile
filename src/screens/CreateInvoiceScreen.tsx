import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/RootNavigator';
import { getCart, clearCart } from '../utils/cartUtil';
import { FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { createInvoice } from '../api/api';
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useTheme } from "@react-navigation/native";
import { colors } from "../utils/color";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { ScrollView } from 'react-native-gesture-handler';

type CreateInvoiceScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvoice'>;

interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const tierIcons: { [key: string]: JSX.Element } = {
  "Hạng Kim Cương": <FontAwesome name="diamond" size={24} color="#16a0bc" />,
  "Hạng Bạc": <MaterialIcons name="stars" size={24} color="#ada7a7" />,
  "Hạng Vàng": <MaterialIcons name="stars" size={24} color="#fcf302" />,
  "Hạng Đồng": <MaterialIcons name="stars" size={24} color="#726b055b" />
};

const CreateInvoiceScreen: React.FC = () => {
  const route = useRoute<CreateInvoiceScreenRouteProp>();
  const customer = route.params.customer;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [promotionReason, setPromotionReason] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCart();
      setCartItems(items);
    };
    fetchCartItems();
  }, []);

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
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
        <Text style={styles.itemName}>{item.productId}</Text>
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
        promotionReason: promotionReason,
        orderSellDetails: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      await createInvoice(invoice);

      Alert.alert('Thành Công', 'Hóa đơn được tạo thành công');
      await clearCart(); // Clear the cart
      navigation.navigate('TabsStack', { screen: 'Home' });
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Có Lỗi xảy ra trong quá trình tạo hóa đơn');
    }
  };

  const { totalPrice, discountedPrice, discount } = getTotalPrice();

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
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
              keyExtractor={item => item.productId}
              contentContainerStyle={styles.listContainer}
            />
          </View>
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            style={{ position: "relative", width: "100%" }}
          >
            <TextInput
              placeholder="Nhập lý do giảm giá"
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: theme.colors.text,
                paddingLeft: 48,
                paddingRight: 12,
                height: 48,
                borderRadius: 12,
                backgroundColor: theme.colors.background,
                width: "100%",
              }}
              onChangeText={setPromotionReason}
              value={promotionReason}
            />
            <Ionicons
              name={"mail-outline"}
              size={24}
              color={theme.colors.text}
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                opacity: 0.5,
              }}
            />
          </Animated.View>
          {/* Display promotions and final price here */}
          <View style={styles.promotionContainer}>
            <View style={styles.promotionInfo}>
              <Text style={styles.promotion}>
                <Fontisto name="shopping-sale" size={16} color="#FF6347" /> Khuyến Mãi: {customer.discountPercent}%
              </Text>
              <Text style={styles.price}>Tổng Giá: {totalPrice} VND</Text>
              <Text style={styles.discount}>Giảm giá: {discount} VND</Text>
              <Text style={styles.finalPrice}>Giá thanh toán: {discountedPrice} VND</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleCreateInvoice}>
              <Text style={styles.buttonText}>Tạo Hóa Đơn</Text>
            </TouchableOpacity>
          </View>
        </View>
    </KeyboardAvoidingView>

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
  infoText: {
    fontSize: 18,
  },
  cartContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  listContainer: {
    flexGrow: 1
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
  },
  itemQuantity: {
    fontSize: 16,
  },
  promotionContainer: {
    marginBottom:100,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  promotionInfo: {
    marginBottom: 16,
  },
  promotion: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  discount: {
    fontSize: 16,
    color: '#333'
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: 'green'
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CreateInvoiceScreen;
