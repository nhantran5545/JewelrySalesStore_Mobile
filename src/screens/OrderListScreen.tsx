import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, TextInput, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/RootNavigator';
import { GetAllOrderList } from '../api/api';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';

type OrderListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderList'>;

const OrderListScreen: React.FC = () => {
  const navigation = useNavigation<OrderListScreenNavigationProp>();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderData = await GetAllOrderList();
        setOrders(orderData);
        setFilteredOrders(orderData);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lấy dữ liệu đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanning(false);
    handleSearch(data);
  };

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  if (hasPermission === null) {
    return <Text>Đang yêu cầu quyền truy cập vào máy ảnh</Text>;
  }
  if (hasPermission === false) {
    return <Text>Không có quyền truy cập vào máy ảnh</Text>;
  }

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
        <TouchableOpacity onPress={() => setScanning(true)}>
          <Ionicons name="qr-code-outline" size={24} color="gray" style={styles.qrIcon} />
        </TouchableOpacity>
      </View>

      {scanning && (
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
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={() => setScanning(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <FlatList
        style={{ marginTop: 10 }}
        data={filteredOrders}
        keyExtractor={item => item.orderSellId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectOrder(item)}>
            <View style={styles.orderItem}>
              {renderStatusBlock(item.status)}
              <Text style={styles.orderText}>Mã đơn hàng: {item.orderSellId}</Text>
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
              <Text style={{ fontSize: 21, textAlign: 'center', marginTop: 5, color: '#d7780b'}}>Tổng tiền: {item.finalAmount.toLocaleString()} VND</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    marginBottom: 8,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBlock: {
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  productDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
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
    backgroundColor: '#FFF',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  qrIcon: {
    marginRight: 8
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default OrderListScreen;
