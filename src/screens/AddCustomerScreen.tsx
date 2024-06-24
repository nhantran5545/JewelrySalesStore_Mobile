import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/RootNavigator';
import { createCustomer } from '../api/api';

type AddCustomerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddCustomer'
>;

const AddCustomerScreen: React.FC = () => {
  const navigation = useNavigation<AddCustomerScreenNavigationProp>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddCustomer = async () => {
    if (!name || !phone) {
      Alert.alert('Cảnh báo', 'Nhập thiếu nội dung');
      return;
    }

    try {
      const customer = {
        name: name,
        phone: phone,
      };

      const response = await createCustomer(customer);

      Alert.alert('Success', 'Customer Created Successfully');
      navigation.navigate('CustomerList');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating customer');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Mới Khách Hàng</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAddCustomer}>
          <Text style={styles.buttonText}>Thêm khách hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#888888',
    marginLeft: 0,
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddCustomerScreen;
