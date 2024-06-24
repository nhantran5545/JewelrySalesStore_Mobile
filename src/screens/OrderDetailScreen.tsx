import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/RootNavigator';
import { GetOrderDetail } from '../api/api';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { addToCartBuyBack } from '../utils/cartBuyBack';
import { GetOrderList, GetProcessingOrderList, cancelOrder, deliverOrder } from '../api/api';

type OrderDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderDetail'>;

const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation<OrderDetailScreenNavigationProp>();
  const route = useRoute();
  const { orderSellId } = route.params as { orderSellId: number };
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await GetOrderDetail(orderSellId);
        setOrderDetail(data);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lấy thông tin chi tiết đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderSellId]);

  // const handleAddToCart = async (product: any) => {
  //   await addToCartBuyBack(product);
  //   Alert.alert('Thêm vào giỏ hàng', `Sản phẩm ${product.productName} đã được thêm vào giỏ hàng.`);
  // };

  const handleAddToCart = async (product: any) => {
    const success = await addToCartBuyBack(product);
    if (success) {
      Alert.alert('Thêm vào giỏ hàng', `Sản phẩm ${product.productName} đã được thêm vào giỏ hàng.`);
    } else {
      Alert.alert('Sản phẩm đã tồn tại', 'Sản phẩm này đã có trong giỏ hàng.');
    }
  };

  const handleDelivery = async () => {
    try {
      await deliverOrder(orderSellId);
      Alert.alert('Success', 'Order marked as delivered.');
      const data = await GetOrderDetail(orderSellId);
      setOrderDetail(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to mark order as delivered.');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder(orderSellId);
      Alert.alert('Success', 'Order cancelled.');
      const data = await GetOrderDetail(orderSellId);
      setOrderDetail(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel order.');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return { backgroundColor: '#4CAF50', color: '#FFF' };
      case 'Processing':
        return { backgroundColor: '#FFC107', color: '#000' };
      case 'Cancelled':
        return { backgroundColor: '#F44336', color: '#FFF' };
      default:
        return { backgroundColor: '#607D8B', color: '#FFF' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {orderDetail && (
        <View>
          <Text style={styles.title}>Đơn Hàng #{orderDetail.orderSellId}</Text>
          <Text style={styles.label}>Khách hàng: {orderDetail.customerName}</Text>
          <Text style={styles.label}>Số điện thoại: {orderDetail.customerPhone}</Text>
          <Text style={styles.label}>Ngày đặt: {new Date(orderDetail.orderDate).toLocaleDateString()}</Text>
          <View style={[styles.statusContainer, getStatusStyle(orderDetail.status)]}>
            <Text style={[styles.statusText, { color: getStatusStyle(orderDetail.status).color }]}>{orderDetail.status}</Text>
          </View>
          <Text style={styles.label}>Tổng số tiền: {orderDetail.totalAmount.toLocaleString()} VND</Text>
          <Text style={styles.label}>Số tiền thanh toán: {orderDetail.finalAmount.toLocaleString()} VND</Text>
          <Text style={styles.sectionTitle}>Chi tiết sản phẩm:</Text>
          <View style={styles.productsContainer}>
            {orderDetail.orderSellDetails.map((detail: any) => (
              <View key={detail.orderSellDetailId} style={styles.productItem}>
                <Image source={{ uri: detail.productImage }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{detail.productName}</Text>
                  <Text style={styles.productQuantity}>{detail.productId}</Text>
                  <Text style={styles.productPrice}>Giá: {detail.price.toLocaleString()} VND</Text>
                  <Text style={styles.productQuantity}>Số lượng: {detail.quantity}</Text>
                  {orderDetail.status === "Delivered" && (
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(detail)}>
                      <FontAwesome5 name="cart-plus" size={24} color="#FFFFFF" />
                      <Text style={styles.addButtonText}>Thêm vào giỏ hàng</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.sectionTitle}>Hình thức thanh toán:</Text>
          <View style={styles.paymentsContainer}>
            {orderDetail.payments.map((payment: any, index: number) => (
              <View key={index} style={styles.paymentItem}>
                <MaterialIcons name="payments" size={24} color="#607D8B" />
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentType}>{payment.paymentTypeName}</Text>
                  <Text style={styles.paymentAmount}>Số tiền: {payment.amount.toLocaleString()} VND</Text>
                  <Text style={styles.paymentDate}>Ngày thanh toán: {new Date(payment.createDate).toLocaleDateString()}</Text>
                </View>
              </View>
            ))}
          </View>
          {/* Nút ở cuối màn hình */}
          <View style={styles.buttonContainer}>
            {orderDetail.status === 'Paid' && (
              <TouchableOpacity style={[styles.button, styles.deliveryButton]} onPress={handleDelivery}>
                <Text style={styles.buttonText}>Delivery</Text>
              </TouchableOpacity>
            )}
            {orderDetail.status === 'Processing' && (
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  statusContainer: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  productsContainer: {
    marginTop: 16,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  productName: {
    width: 200,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    color: '#FF6347',
    marginTop: 4,
  },
  productQuantity: {
    fontSize: 18,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  paymentsContainer: {
    marginTop: 16,
  },
  paymentItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentInfo: {
    marginLeft: 16,
  },
  paymentType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentAmount: {
    fontSize: 18,
    marginTop: 4,
    color: '#607D8B',
  },
  paymentDate: {
    fontSize: 16,
    marginTop: 4,
    color: '#999',
  },buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deliveryButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default OrderDetailScreen;
