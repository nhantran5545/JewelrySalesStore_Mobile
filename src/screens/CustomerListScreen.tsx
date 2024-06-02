// CustomerListScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigators/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/RootNavigator';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import SearchCustomer from '../components/SearchCustomer';

type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
};

type CustomerListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CustomerList'
>;

const CustomerListScreen: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const navigation = useNavigation<RootStackScreenProps<'CustomerList'>['navigation']>();
  const navigation = useNavigation<CustomerListScreenNavigationProp>();


  useFocusEffect(
    useCallback(() => {
      const fetchCustomers = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await axios.get('http://10.0.128.112:3000/customers');
          setCustomers(response.data);
        } catch (error) {
          setError('Failed to fetch customers');
        } finally {
          setLoading(false);
        }
      };

      fetchCustomers();
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

  const renderItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleCustomerSelect(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemSubText}>{item.phone}</Text>
      <Text style={styles.itemSubText}>{item.address}</Text>
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
      <SearchCustomer/>
      <FlatList
        data={customers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
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
