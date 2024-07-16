import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/RootNavigator';
import { GetOrderDetailBuyBack } from '../api/api';
import { MaterialIcons } from '@expo/vector-icons';

type OrderDetailBuyBackScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderDetailBuyBack'>;

const OrderDetailBuyBackScreen: React.FC = () => {
  const navigation = useNavigation<OrderDetailBuyBackScreenNavigationProp>();
  const route = useRoute();
  const { orderBuyBackId } = route.params as { orderBuyBackId: number };
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetailBuyBack = async () => {
      try {
        const data = await GetOrderDetailBuyBack(orderBuyBackId);
        setOrderDetail(data);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lấy thông tin chi tiết đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetailBuyBack();
  }, [orderBuyBackId]);

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
          <Text style={styles.title}>Chi tiết Đơn hàng #{orderDetail.orderBuyBackId}</Text>
          <Text style={styles.label}>Khách hàng: {orderDetail.customerName}</Text>
          <Text style={styles.label}>Điện thoại: {orderDetail.customerPhone}</Text>
          <Text style={styles.label}>Ngày mua lại: {new Date(orderDetail.dateBuyBack).toLocaleDateString()}</Text>
          <View style={[styles.statusContainer, getStatusStyle(orderDetail.status)]}>
            <Text style={[styles.statusText, { color: getStatusStyle(orderDetail.status).color }]}>
              {orderDetail.status}
            </Text>
          </View>
          <Text style={styles.label}>Tổng số tiền: {orderDetail.totalAmount.toLocaleString()} VND</Text>
          <Text style={styles.label}>Số tiền cuối cùng: {orderDetail.finalAmount.toLocaleString()} VND</Text>
          <Text style={styles.sectionTitle}>Chi tiết sản phẩm:</Text>
          <View style={styles.productsContainer}>
            {orderDetail.orderBuyBackDetails.map((detail: any, index: number) => (
              <View key={detail.productId || index} style={styles.productItem}>
                {/* <Image source={{ uri: detail.productImage }} style={styles.productImage} /> */}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{detail.productName}{detail.buyBackProductName}</Text>
                  <Text style={styles.productPrice}>Quantity: 1</Text>
                  {detail.weight && (
                    <Text style={styles.productPrice}>Weight: {detail.weight} Gram</Text>
                  )}

                  {detail.caratWeight > 0 && (
                    <Text style={styles.productPrice}>Carat: {detail.caratWeight}</Text>
                  )}

                  {detail.origin && (
                    <Text style={styles.productPrice}>Origin: {detail.origin}</Text>
                  )}
                  {detail.color && (
                    <Text style={styles.productPrice}>Color: {detail.color}</Text>
                  )}
                  {detail.clarity && (
                    <Text style={styles.productPrice}>Clarity: {detail.clarity}</Text>
                  )}
                  {detail.cut && (
                    <Text style={styles.productPrice}>Cut: {detail.cut}</Text>
                  )}
                  <Text style={styles.productPrice}>Giá: {detail.price.toLocaleString()} VND</Text>
                </View>
              </View>
            ))}
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
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Processing':
      return { backgroundColor: '#ff7875', color: '#000' };
    case 'Paid':
      return { backgroundColor: '#ffa940', color: '#000' };
    case 'Approval':
      return { backgroundColor: '#36cfc9', color: '#000' };
    case 'Approved':
      return { backgroundColor: '#4096ff', color: '#FFF' };
    case 'Delivered':
      return { backgroundColor: '#95de64', color: '#000' };
    case 'Cancelled':
      return { backgroundColor: '#595959', color: '#FFF' };
    default:
      return { backgroundColor: '#9E9E9E', color: '#FFF' };
  }
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
  paymentsContainer: {
    marginTop: 16,
    marginBottom: 5
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
  }, buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default OrderDetailBuyBackScreen;
