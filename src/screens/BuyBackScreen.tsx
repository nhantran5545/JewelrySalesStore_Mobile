import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// type BuyBackScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'BuyBack'
// >;

const BuyBackScreen: React.FC = () => {
  // const navigation = useNavigation<BuyBackScreenNavigationProp>();

  const handleGuestCustomer = () => {
    // Chuyển đến trang dành cho Khách Vãn Lai
    // navigation.navigate('GuestCustomer');
    alert('khách Vãng lai');
  };

  const handleStoreCustomer = () => {
    // Chuyển đến trang dành cho Khách của Cửa Hàng
    // navigation.navigate('StoreCustomer');
    alert('khách cửa hàng');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn Loại Khách Hàng</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGuestCustomer}>
          <Ionicons name="person-outline" size={40} color="black" />
          <Text style={styles.buttonText}>Khách Vãng Lai</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleStoreCustomer}>
          <Ionicons name="person-sharp" size={40} color="black" />
          <Text style={styles.buttonText}>Khách Cửa Hàng</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default BuyBackScreen;
