import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/RootNavigator';

type CustomerInfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CustomerInfo'
>;

type CustomerInfoScreenRouteProp = RouteProp<RootStackParamList, 'CustomerInfo'>;

const CustomerInfoScreen: React.FC = () => {
  const navigation = useNavigation<CustomerInfoScreenNavigationProp>();
  const route = useRoute<CustomerInfoScreenRouteProp>();
  const customer = route.params?.customer;
  const [isCustomerSelected, setIsCustomerSelected] = useState<boolean>(false);

  useEffect(() => {
    if (customer) {
      setIsCustomerSelected(true);
    }
  }, [customer]);

  const handleNextStep = () => {
    // Handle next step action
    // alert('Next Step');
    navigation.navigate('CreateInvoice', { customer });
  };

  const handleSelectCustomer = () => {
    navigation.navigate('CustomerList');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông Tin Khách Hàng</Text>
      {isCustomerSelected && customer ? (
        <>
          <Text style={styles.infoText}>Họ và tên: {customer.name}</Text>
          <Text style={styles.infoText}>Số điện thoại: {customer.phone}</Text>
          <Text style={styles.infoText}>Địa chỉ: {customer.address}</Text>
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>Bước Tiếp Theo</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.infoText}>Vui lòng chọn khách hàng để tiếp tục</Text>
          <TouchableOpacity style={styles.button} onPress={handleSelectCustomer}>
            <Text style={styles.buttonText}>Chọn Khách Hàng</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomerInfoScreen;
