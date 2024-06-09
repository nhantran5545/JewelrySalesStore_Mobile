import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/RootNavigator';
import { Feather } from '@expo/vector-icons';
import { fetchCustomers } from '../api/api';
import SearchCustomer from '../components/SearchCustomer';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Customer = {
  customerId: string;
  tierId: number;
  tierName: string;
  name: string;
  phone: string;
  address: string;
  loyaltyPoints: number;
  discountPercent: number;
};

type CustomerListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CustomerList'
>;

const tierIcons: { [key: string]: JSX.Element } = {
  "Hạng Kim Cương": <FontAwesome name="diamond" size={24} color="#16a0bc" />,
  "Hạng Bạc": <MaterialCommunityIcons name="gold" size={24} color="#b6b1b1" />,
  "Hạng Vàng": <MaterialCommunityIcons name="gold" size={24} color="#ecec58" />,
};

const CustomerListScreen: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<CustomerListScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      const fetchCustomerData = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchCustomers();
          setCustomers(data);
          setFilteredCustomers(data); // Ban đầu, filteredCustomers sẽ chứa toàn bộ danh sách customers
        } catch (error) {
          setError('Failed to fetch customers');
        } finally {
          setLoading(false);
        }
      };

      fetchCustomerData();
    }, [])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddCustomer")} style={styles.addButton}>
          <Feather name="plus" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleCustomerSelect = (customer: Customer) => {
    navigation.navigate('CustomerInfo', { customer });
  };

  const handleSearch = (query: string) => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone.includes(query)
    );
    setFilteredCustomers(filtered);
  };

  const renderItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleCustomerSelect(item)}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemText}>{item.name}</Text>
        {item.tierName && tierIcons[item.tierName]}
      </View>
      <Text style={styles.itemSubText}>{item.phone}</Text>
      <Text style={styles.itemSubText}>{item.address}</Text>
      <Text style={styles.itemSubText}>Điểm: {item.loyaltyPoints}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (customers.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Không có khách hàng nào</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchCustomer onSearch={handleSearch} />
      <FlatList
        data={filteredCustomers}
        renderItem={renderItem}
        keyExtractor={item => item.customerId}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tierIcon: {
    width: 24,
    height: 24,
  },
  itemSubText: {
    fontSize: 14,
    color: '#888888',
  },
  backButton: {
    marginLeft: 16,
  },
  addButton: {
    marginRight: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
  },
});

export default CustomerListScreen;
