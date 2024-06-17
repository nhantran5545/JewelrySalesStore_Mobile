import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

type BuyBackScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BuyBack'
>;

const BuyBackScreen: React.FC = () => {
  const navigation = useNavigation<BuyBackScreenNavigationProp>();

  const handleProductOutStore = () => {
    // Chuyển đến trang dành cho sản phẩm mua lại ngoài cửa hàng
    navigation.navigate('ProductList');
  };

  const handleProductInStore = () => {
    // Chuyển đến trang dành cho Khách của Cửa Hàng
    navigation.navigate('OrderList');
    // alert('Mua sản phẩm từ cửa hàng');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn Loại Sản Phẩm Mua Lại</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleProductOutStore}>
          <FontAwesome name="external-link-square" size={40} color="black" />
          <Text style={styles.buttonText}>Sản phẩm ngoài cửa hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleProductInStore}>
          <FontAwesome5 name="store" size={40} color="black" />
          <Text style={styles.buttonText}>Sản phẩm từ cửa hàng</Text>
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
    width: 140,
    textAlign: 'center'
  },
});

export default BuyBackScreen;
