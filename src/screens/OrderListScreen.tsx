import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/RootNavigator';
import { GetAllOrderList, GetOrderList } from '../api/api';
import SearchCustomer from '../components/SearchCustomer'; // Make sure the path is correct

type OrderListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderList'>;

const OrderListScreen: React.FC = () => {
  const navigation = useNavigation<OrderListScreenNavigationProp>();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderData = await GetAllOrderList();
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
      <FlatList style={{ marginTop: 10 }}
        data={filteredOrders}
        keyExtractor={item => item.orderSellId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectOrder(item)}>
            <View style={styles.orderItem}>
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
});

export default OrderListScreen;
