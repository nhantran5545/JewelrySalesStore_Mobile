import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/RootNavigator';
import { GetOrderBuyBackList, cancelBuyBackOrder, cancelOrder } from '../api/api'; // Assuming GetOrderBuyBackList is defined in api.ts
import { Ionicons } from '@expo/vector-icons';

type OrderListBuyBackScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderListBuyBack'>;

const OrderListBuyBackScreen: React.FC = () => {
  const navigation = useNavigation<OrderListBuyBackScreenNavigationProp>();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orderData = await GetOrderBuyBackList();
        setOrders(orderData);
        setFilteredOrders(orderData);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch order data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSelectOrder = (order: any) => {
    navigation.navigate('OrderDetailBuyBack', { orderBuyBackId: order.orderBuyBackId });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = orders.filter(order =>
        order.customerName.toLowerCase().includes(query.toLowerCase()) ||
        order.customerPhone.includes(query) ||
        order.orderBuyBackId.toString().includes(query)
      );
      setFilteredOrders(filteredData);
    } else {
      setFilteredOrders(orders);
    }
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

  const handleCancel = async (orderBuyBackId: number) => {
    try {
      await cancelBuyBackOrder(orderBuyBackId);
      Alert.alert('Success', 'Order cancelled.');
      const orderData = await GetOrderBuyBackList();
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
      </View>

      <FlatList
        style={{ marginTop: 10 }}
        data={filteredOrders}
        keyExtractor={item => item.orderBuyBackId.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <TouchableOpacity onPress={() => handleSelectOrder(item)}>
              <View>
                <View style={styles.statusContainer}>
                  {renderStatusBlock(item.status)}
                  <Text style={styles.orderText}>Mã đơn hàng: {item.orderBuyBackId}</Text>
                </View>
                <Text style={styles.orderText}>Khách hàng: {item.customerName}</Text>
                <Text style={styles.orderText}>SĐT: {item.customerPhone}</Text>
                <Text style={styles.orderText}>Ngày: {new Date(item.dateBuyBack).toLocaleDateString()}</Text>
                <FlatList
                  data={item.orderBuyBackDetails}
                  keyExtractor={(detail, index) => detail.productId ? detail.productId.toString() : index.toString()}
                  renderItem={({ item: detail }) => (
                    <View style={styles.productDetail}>
                      {/* <Image source={{ uri: detail.productImage }} style={styles.productImage} /> */}
                      <View style={styles.productInfo}>
                        <Text style={styles.productText}> {detail.productName} {detail.buyBackProductName}</Text>
                        {/* <Text style={styles.productText}> {detail.productId}</Text> */}
                        {detail.productId && (
                          <Text style={styles.productText}>{detail.productId}</Text>
                        )}
                        <Text style={styles.productText}> {detail.price.toLocaleString()} VND</Text>
                        <Text style={styles.productText}>-----------------------------------------------------</Text>
                      </View>
                    </View>
                  )}
                />
                <Text style={styles.orderText}>Tổng Tiền {item.finalAmount.toLocaleString()} VND</Text>
              </View>
            </TouchableOpacity>
            {item.status !== 'Cancelled' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => handleCancel(item.orderBuyBackId)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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
    marginBottom: 16,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 8,
  },
  productDetail: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productInfo: {
    marginLeft: 20,
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
});

export default OrderListBuyBackScreen;
