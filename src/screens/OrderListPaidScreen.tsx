import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, TextInput, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/RootNavigator';
import { GetOrderList, GetProcessingOrderList, cancelOrder, deliverOrder } from '../api/api';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import SearchCustomer from '../components/SearchCustomer';
import DropdownTypeProduct from '../components/DropdownTypeProduct';

type OrderListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderList'>;

const OrderListPaidScreen: React.FC = () => {
  const navigation = useNavigation<OrderListScreenNavigationProp>();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('Paid'); // Default to 'Paid'
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let orderData;
        if (orderType === 'Paid') {
          orderData = await GetOrderList();
        } else if (orderType === 'Processing') {
          orderData = await GetProcessingOrderList();
        }
        setOrders(orderData);
        setFilteredOrders(orderData);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch order data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderType]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleSelectOrder = (order: any) => {
    navigation.navigate('OrderDetail', { orderSellId: order.orderSellId });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = orders.filter(order =>
        order.customerName.toLowerCase().includes(query.toLowerCase()) ||
        order.customerPhone.includes(query) ||
        order.orderSellId.toString().includes(query) ||
        order.orderSellDetails.some((detail: any) =>
          detail.productName.toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredOrders(filteredData);
    } else {
      setFilteredOrders(orders);
    }
  };

  // const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
  //   setScanning(false);
  //   handleSearch(data);
  // };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Processing':
        return '#ff7875';
      case 'Paid':
        return '#ffa940';
      case 'Approval':
        return '#36cfc9';
      case 'Approved':
        return '#4096ff';
      case 'Delivered':
        return '#95de64';
      case 'Cancelled':
        return '#595959';
      default:
        return '#9E9E9E';
    }
  };

  const renderStatusBlock = (status: string) => {
    const statusColor = getStatusColor(status);
    return (
      <View style={[styles.statusBlock, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  const handleDelivery = async (orderSellId: number) => {
    try {
      await deliverOrder(orderSellId);
      Alert.alert('Success', 'Order marked as delivered.');
      const orderData = await GetOrderList();
      setOrders(orderData);
      setFilteredOrders(orderData);
    } catch (error) {
      Alert.alert('Error', 'Failed to mark order as delivered.');
    }
  };

  const handleCancel = async (orderSellId: number) => {
    try {
      await cancelOrder(orderSellId);
      Alert.alert('Success', 'Order cancelled.');
      const orderData = await GetProcessingOrderList();
      setOrders(orderData);
      setFilteredOrders(orderData);
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel order.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  // if (hasPermission === null) {
  //   return <Text>Đang yêu cầu quyền truy cập vào máy ảnh</Text>;
  // }
  // if (hasPermission === false) {
  //   return <Text>Không có quyền truy cập vào máy ảnh</Text>;
  // }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thông tin hóa đơn"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {/* <TouchableOpacity onPress={() => setScanning(true)}>
          <Ionicons name="qr-code-outline" size={24} color="gray" style={styles.qrIcon} />
        </TouchableOpacity> */}
      </View>

      {/* {scanning && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={scanning}
          onRequestClose={() => setScanning(false)}
        >
          <View style={styles.modalContainer}>
            <BarCodeScanner
              onBarCodeScanned={scanning ? handleBarCodeScanned : undefined}
              style={StyleSheet.absoluteFillObject}
            />
            <Button title="Đóng" onPress={() => setScanning(false)} />
          </View>
        </Modal>
      )} */}

      <View style={{ marginTop: 5, width: 360, marginLeft: 2 }}>
        <DropdownTypeProduct
          data={[
            { label: 'Paid', value: 'Paid' },
            { label: 'Processing', value: 'Processing' },
          ]}
          value={orderType}
          onChange={(item) => setOrderType(item.value)}
          placeholder="Chọn loại Hóa Đơn"
        />
      </View>
      {filteredOrders.length === 0 ? (
        <Text style={styles.noOrdersText}>Không có hóa đơn nào trong danh sách</Text>
      ) : (
      <FlatList
        style={{ marginTop: 10 }}
        data={filteredOrders}
        keyExtractor={item => item.orderSellId.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <TouchableOpacity onPress={() => handleSelectOrder(item)}>
              <View>
                <View style={styles.statusContainer}>
                  {renderStatusBlock(item.status)}
                  <Text style={styles.orderText}>Mã đơn hàng: {item.orderSellId}</Text>
                </View>
                <Text style={styles.orderText}>Khách hàng: {item.customerName}</Text>
                <Text style={styles.orderText}>SĐT: {item.customerPhone}</Text>
                <Text style={styles.orderText}>Ngày: {new Date(item.orderDate).toLocaleDateString()}</Text>
                <FlatList
                  data={item.orderSellDetails}
                  keyExtractor={detail => detail.orderSellDetailId.toString()}
                  renderItem={({ item: detail }) => (
                    <View style={styles.productDetail}>
                      <Image source={{ uri: detail.productImage }} style={styles.productImage} />
                      <View style={styles.productInfo}>
                        <Text style={styles.productText}> {detail.productName}</Text>
                        <Text style={styles.productText}> {detail.productId}</Text>
                        <Text style={styles.productText}> {detail.price.toLocaleString()} VND</Text>
                      </View>
                    </View>
                  )}
                />
                <Text style={styles.orderText}>Tổng Tiền: {item.finalAmount.toLocaleString()} VND</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              {orderType === 'Paid' ? (
                <TouchableOpacity
                  style={[styles.button, styles.deliveryButton]}
                  onPress={() => handleDelivery(item.orderSellId)}
                >
                  <Text style={styles.buttonText}>Delivery</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => handleCancel(item.orderSellId)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 8,
  },
  orderItem: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 8,
  },
  productDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productText: {
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  qrIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBlock: {
    width: 15,
    height: 15,
    paddingLeft: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  noOrdersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default OrderListPaidScreen;
