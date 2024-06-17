import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/RootNavigator';
import { GetOrderList, GetProcessingOrderList, cancelOrder, deliverOrder } from '../api/api';
import SearchCustomer from '../components/SearchCustomer';
import DropdownTypeProduct from '../components/DropdownTypeProduct';

type OrderListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderList'>;

const OrderListPaidScreen: React.FC = () => {
  const navigation = useNavigation<OrderListScreenNavigationProp>();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState('Paid'); // Default to 'Paid'

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

  const handleSelectOrder = (order: any) => {
    navigation.navigate('OrderDetail', { orderSellId: order.orderSellId });
  };

  const handleSearch = (query: string) => {
    if (query) {
      const filteredData = orders.filter(order =>
        order.customerName.toLowerCase().includes(query.toLowerCase()) ||
        order.customerPhone.includes(query)
      );
      setFilteredOrders(filteredData);
    } else {
      setFilteredOrders(orders);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Paid':
        return '#607D8B';
      case 'Processing':
        return '#FFC107';
      case 'Cancelled':
        return '#F44336';
      case 'Completed':
        return '#4CAF50';
      default:
        return '#9E9E9E'; // Grey
    }
  };

  const renderStatusBlock = (status: string) => {
    const statusColor = getStatusColor(status);
    return <View style={[styles.statusBlock, { backgroundColor: statusColor }]} />;
  };

  const orderTypes = [
    { label: 'Paid', value: 'Paid' },
    { label: 'Processing', value: 'Processing' },
  ];

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

  return (
    <View style={styles.container}>
      <SearchCustomer onSearch={handleSearch} />
      <View style={{ marginTop : 5, width: 360, marginLeft: 20}}>
        <DropdownTypeProduct
          data={orderTypes}
          value={orderType}
          onChange={(item) => setOrderType(item.value)}
          placeholder="Chọn loại Hóa Đơn"
        />
      </View>
      <FlatList style={{ marginTop: 10 }}
        data={filteredOrders}
        keyExtractor={item => item.orderSellId.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <TouchableOpacity onPress={() => handleSelectOrder(item)}>
              <View>
                <View style={styles.statusContainer}>
                  {renderStatusBlock(item.status)}
                  <Text style={styles.orderText}>Order Number: {item.orderSellId}</Text>
                </View>
                <Text style={styles.orderText}>Customer: {item.customerName}</Text>
                <Text style={styles.orderText}>Phone: {item.customerPhone}</Text>
                <Text style={styles.orderText}>Date: {new Date(item.orderDate).toLocaleDateString()}</Text>
                <Text style={styles.orderText}>Status: {item.status}</Text>
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
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
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
});

export default OrderListPaidScreen;
