import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

interface MenuProps {
  navigation: NavigationProp<ParamListBase>;
}

const Menu: React.FC<MenuProps> = ({ navigation }) => {
  const goToOrderList = () => {
    navigation.navigate('OrderListPaid');
  };

  const goToRepurchasedOrders = () => {
    // navigation.navigate('RepurchasedOrders');
  };

  const goToCartBuyBack = () => {
    navigation.navigate('CartBuyBack');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToOrderList} style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="list" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Danh sách Hóa Đơn</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToRepurchasedOrders} style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="history" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Danh sách Hóa Đơn Mua Lại</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToCartBuyBack} style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="shopping-cart" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Giỏ Hàng Mua Lại</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  menuItem: {
    marginBottom: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CB9E7', // Màu của khung chữ nhật
    padding: 10,
  },
  iconContainer: {
    backgroundColor: '#4CB9E7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Menu;
