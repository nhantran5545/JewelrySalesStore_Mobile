import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigators/RootNavigator';
import { useRoute } from '@react-navigation/native';
import { createBuyBackInvoice } from '../api/api';
import { clearCartBuyBack, getCartBuyBack, removeFromCartBuyBack } from '../utils/cartBuyBack';
import { calculateBuyBackPrice, createOrderBuyBackStore } from '../api/api';
import { fetchProductById } from '../api/api'; 
import { RouteProp, useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';

type CreateInvoiceBuyBackScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvoice'>;

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

const tierIcons: { [key: string]: JSX.Element } = {
    "Hạng Kim Cương": <FontAwesome name="diamond" size={24} color="#16a0bc" />,
    "Hạng Bạc": <MaterialIcons name="stars" size={24} color="#ada7a7" />,
    "Hạng Vàng": <MaterialIcons name="stars" size={24} color="#fcf302" />,
    "Hạng Đồng": <MaterialIcons name="stars" size={24} color="#726b055b" />
};

const CreateOrderBuyBackStoreScreen: React.FC = () => {
    const route = useRoute<CreateInvoiceBuyBackScreenRouteProp>();
    // const navigation = useNavigation();
    const customer = route.params.customer;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [cartBuyBackItems, setCartBuyBackItems] = useState<Product[]>([]);

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

    const handleCreateInvoice = async () => {
        try {
            const productIds = cartBuyBackItems.map(item => item.productId);
            const invoiceData = {
                customerId: customer.customerId,
                productIds,
            };
            console.log(invoiceData);
            await createOrderBuyBackStore(invoiceData); 
            Alert.alert('Success', 'Invoice created successfully!');
            await clearCartBuyBack();
            navigation.navigate('TabsStack', { screen: 'Home' });
        } catch (error) {
            Alert.alert('Error', 'Failed to create invoice');
            console.error('Error creating invoice:', error);
        }
    };


    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.productImage }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.productName}</Text>
            <Text style={styles.productId}>{item.productId}</Text>
            <Text style={styles.price}>Giá đơn hàng: {item.price.toLocaleString()} VND</Text>
            {/* <Text style={styles.price}>Giá bán hiện tại: {item.productPrice?.toLocaleString()} VND</Text> */}
            <Text style={styles.price}>Giá mua lại: {item.buyBackPrice?.toLocaleString()} VND</Text>
            <Text style={styles.price}>Chiết khấu: {item.discountRate}%</Text>
            <Text style={styles.price}>Giá: {item.finalBuyBackPrice?.toLocaleString()} VND</Text>
            <Text style={styles.quantity}>Số Lượng: {item.quantity}</Text>
          </View>
        </View>
      );

    const getTotalPrice = () => {
        return cartBuyBackItems.reduce((total, item) => total + item.finalBuyBackPrice * item.quantity, 0).toLocaleString();
    };

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
                    data={cartBuyBackItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.productId}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
            <View style={styles.promotionContainer}>
                <View style={styles.promotionInfo}>
                    <Text style={styles.finalPrice}>Tổng Giá: {getTotalPrice()} VND</Text>
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
    }, card: {
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
    totalPrice: {
        fontSize: 25,
        color: '#080000',
        fontWeight: 'bold'
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
});

export default CreateOrderBuyBackStoreScreen;
